from fastapi import APIRouter, HTTPException, Request, Response
from typing import List, Dict, Any
from pydantic import BaseModel
import time
import httpx
import json
from .voice_assistant import voice_chat
from backend_services.agents.google_search_agent.agent import get_google_search_response as agent_response
from google.adk.runners import InMemoryRunner
from google.genai import types
import os
from dotenv import load_dotenv
from livekit.api import AccessToken, VideoGrants

load_dotenv()

class ChatMessage(BaseModel):
    id: int
    sender: str
    text: str
    chartData: list | None = None
    type: str | None = None

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

router = APIRouter()

# --- Mock Data ---

action_log_data = [
    {
        "id": 1,
        "status": "success",
        "action": "Adjusted Kiln Feed Rate",
        "parameter": "Feed Rate",
        "value": "250 t/h",
        "timestamp": "2023-10-27T10:00:00Z"
    },
    {
        "id": 2,
        "status": "success",
        "action": "Increased Cooler Fan Speed",
        "parameter": "Fan Speed",
        "value": "75%",
        "timestamp": "2023-10-27T09:30:00Z"
    }
]

recommendations_data = [
    {
        "id": 1,
        "status": "pending",
        "recommendation": "Increase fuel rate by 2% to stabilize temperature.",
        "confidence": 0.95,
        "timestamp": "2023-10-27T10:05:00Z"
    },
    {
        "id": 2,
        "status": "pending",
        "recommendation": "Reduce raw meal moisture content.",
        "confidence": 0.88,
        "timestamp": "2023-10-27T10:10:00Z"
    }
]

energy_cockpit_data = {
    "fuel_consumption": {"currentRate": 12.5, "trend": "up", "dailyAverage": 12.1},
    "energy_efficiency": {"sec": 3200, "trend": "down", "target": 3150},
    "cost_analysis": {"estimatedDailyCost": 50000, "savingsToday": 1200},
    "emissions_monitoring": {"currentCO2": 0.85, "trend": "stable", "limit": 0.9},
    "trends": [
        {"name": "00:00", "consumption": 290},
        {"name": "04:00", "consumption": 285},
        {"name": "08:00", "consumption": 300},
        {"name": "12:00", "consumption": 310},
        {"name": "16:00", "consumption": 305},
        {"name": "20:00", "consumption": 295}
    ]
}

process_flow_data = [
    {"id": "1", "label": "Raw Material Crushing", "status": "completed", "message": "OK"},
    {"id": "2", "label": "Raw Grinding", "status": "completed", "message": "OK"},
    {"id": "3", "label": "Pre-heating", "status": "running", "message": "Temp at 850°C"},
    {"id": "4", "label": "Clinker Cooling", "status": "pending", "message": "Awaiting feed"},
    {"id": "5", "label": "Kiln Burning", "status": "failed", "message": "Temp spike detected"},
    {"id": "6", "label": "Finish Grinding", "status": "pending", "message": "Idle"},
]

kiln_health_data = {
    "status": "Warning",
    "operational_parameters": {
        "fuel_consumption": {"value": 12.8, "unit": "t/h"},
        "kiln_temp": {"value": 1485, "unit": "°C"}
    },
    "trends": [
        {"time": "10:00", "temp": 1450, "pressure": -5.2, "oxygen": 2.1},
        {"time": "10:01", "temp": 1455, "pressure": -5.2, "oxygen": 2.1},
        {"time": "10:02", "temp": 1465, "pressure": -5.3, "oxygen": 2.0},
        {"time": "10:03", "temp": 1475, "pressure": -5.4, "oxygen": 2.0},
        {"time": "10:04", "temp": 1480, "pressure": -5.4, "oxygen": 1.9},
        {"time": "10:05", "temp": 1485, "pressure": -5.5, "oxygen": 1.9}
    ],
    "recent_alerts": [
        {"id": 1, "type": "Critical", "message": "Kiln temperature exceeds critical threshold!", "timestamp": "2023-10-27T10:05:15Z"},
        {"id": 2, "type": "Warning", "message": "Oxygen level in pre-heater is low.", "timestamp": "2023-10-27T09:45:00Z"}
    ]
}

predictive_quality_data = {
    "predicted_fcao": 1.25,
    "confidence_interval": "95%",
    "target_fcao_range": "1.0-1.5%",
    "target_fcao_min": 1.0,
    "target_fcao_max": 1.5,
    "trends": [
        {"name": "Day 1", "fcao": 1.3},
        {"name": "Day 2", "fcao": 1.4},
        {"name": "Day 3", "fcao": 1.2},
        {"name": "Day 4", "fcao": 1.5},
        {"name": "Day 5", "fcao": 1.35},
        {"name": "Day 6", "fcao": 1.28},
        {"name": "Day 7", "fcao": 1.42}
    ],
    "correlation_data": [
        {"temp": 1450, "fcao": 1.2},
        {"temp": 1460, "fcao": 1.35},
        {"temp": 1445, "fcao": 1.15},
        {"temp": 1470, "fcao": 1.45},
        {"temp": 1455, "fcao": 1.25},
    ]
}

variance_analysis_data = [
    {
        "metric_name": "Kiln Temperature",
        "value": 1502.5,
        "timestamp": "2023-10-27T08:30:00Z",
        "is_anomaly": True
    },
    {
        "metric_name": "Fuel Consumption Rate",
        "value": 13.1,
        "timestamp": "2023-10-27T08:30:00Z",
        "is_anomaly": False
    },
    {
        "metric_name": "f-CaO Content",
        "value": 1.8,
        "timestamp": "2023-10-27T08:30:00Z",
        "is_anomaly": True
    }
]

# --- API Endpoints ---

@router.get("/agent/actions")
def get_agent_actions():
    return action_log_data

@router.get("/agent/recommendations")
def get_agent_recommendations():
    return recommendations_data

@router.post("/agent/recommendations/{rec_id}/approve")
def approve_recommendation(rec_id: int):
    for rec in recommendations_data:
        if rec["id"] == rec_id:
            rec["status"] = "approved"
            return {"message": "Recommendation approved"}
    raise HTTPException(status_code=404, detail="Recommendation not found")

@router.post("/agent/recommendations/{rec_id}/reject")
def reject_recommendation(rec_id: int):
    for rec in recommendations_data:
        if rec["id"] == rec_id:
            rec["status"] = "rejected"
            return {"message": "Recommendation rejected"}
    raise HTTPException(status_code=404, detail="Recommendation not found")

@router.get("/energy_cockpit")
def get_energy_cockpit(timerange: str = "7d"):
    return energy_cockpit_data

@router.get("/process_flow")
def get_process_flow():
    return process_flow_data

@router.post("/agent_chat")
async def agent_chat(request: ChatRequest):
    try:
        print("Received message for agent chat:", request.message)
        response = await agent_response(request.message)
        
        # response = "Hi hello"
        return {
            "id": int(time.time()),
            "sender": "ai",
            "text": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing agent chat: {e}")

@router.post("/data_science_chat")
async def data_science_chat(request: ChatRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://127.0.0.1:8080/api/run",
                json={"query": request.message, "user_id": "user"},
                timeout=120,
            )
            response.raise_for_status()
            # The response from the ADK agent is a streaming response.
            # We need to read the streaming content and extract the text.
            # The format is a server-sent event stream.
            # A line starts with `data: ` and contains a JSON object.
            # The JSON object has a `text` field.
            # We will concatenate the text from all events.
            full_text = ""
            for line in response.text.splitlines():
                if line.startswith("data:"):
                    try:
                        data = json.loads(line[5:])
                        if "text" in data:
                            full_text += data["text"]
                    except json.JSONDecodeError:
                        pass # Ignore lines that are not valid JSON
            return {
                "id": int(time.time()),
                "sender": "ai",
                "text": full_text
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to data science agent: {e}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error from data science agent: {e.response.text}")

@router.get("/kiln_health")
def get_kiln_health(timerange: str = "24h"):
    return kiln_health_data

@router.get("/predictive_quality")
def get_predictive_quality(timerange: str = "7d"):
    return predictive_quality_data

@router.get("/variance_analysis")
def get_variance_analysis():
    return variance_analysis_data

@router.get("/overview")
def get_overview():
    return {
        "action_log": action_log_data,
        "recommendations": recommendations_data,
        "energy_cockpit": energy_cockpit_data,
        "process_flow": process_flow_data,
        "kiln_health": kiln_health_data,
        "predictive_quality": predictive_quality_data,
        "variance_analysis": variance_analysis_data,
    }


settings_data = {
    "darkMode": False,
    "language": "en",
    "notificationsEnabled": True,
    "userName": "John Doe",
    "userEmail": "john.doe@example.com",
}

@router.get("/settings")
def get_settings():
    return settings_data

@router.post("/settings")
def update_settings(new_settings: Dict[str, Any]):
    settings_data.update(new_settings)
    return settings_data

@router.post("/voice_chat")
async def post_voice_chat(request: Request):
    audio_data = b""
    async for chunk in request.stream():
        audio_data += chunk
    transcribed_text, audio_response = voice_chat(audio_data)

    if not transcribed_text:
        raise HTTPException(status_code=400, detail="Could not transcribe audio.")

    if not audio_response:
        return {"text": transcribed_text}

    return Response(content=audio_response, media_type="audio/mpeg")

LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET")

@router.get("/livekit-token")
def get_livekit_token(room_name: str, participant_name: str):
    livekit_api_key = os.getenv('LIVEKIT_API_KEY', 'devkey')
    livekit_api_secret = os.getenv('LIVEKIT_API_SECRET', 'secret')

    token = (
        AccessToken(livekit_api_key, livekit_api_secret)
        .with_identity(participant_name)
        .with_name(participant_name)
        .with_grants(VideoGrants(
            room_join=True,
            room=room_name,
        )).to_jwt()
    )
    return {"token": token}