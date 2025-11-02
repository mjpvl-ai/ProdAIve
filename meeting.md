# Hackathon Mentorship Meeting Agenda

**Project:** ProdAIve - An Autonomous Cement Plant Optimization Platform

**Date:** October 27, 2025
**Time:** 2:00 PM - 4:00 PM

**Attendees:**

*   **Mentors:** (Mentor Team Names)
*   **Team ProdAIve:** Jayaprakash Murugan (Team Leader), (Other Team Members)

### **Our Goal for this Session**

To validate our product strategy and technical approach with you. We want to ensure we are solving the right problem, building the right solution, and are on the fastest path to demonstrating significant impact for Showcase Day.

### **Key Takeaways We Want to Convey**

1.  **The Problem is Urgent & Costly:** Reactive quality control is a major source of inefficiency in the cement industry.
2.  **Our Solution is Direct:** We are not just building a dashboard; we are building a predictive engine to eliminate the root cause of the problem—measurement time lag.
3.  **The Tech is a Means to an End:** We are using the Google AI stack specifically to deliver proactive, actionable insights that a plant operator can trust and use.

---

## 1. The Core Problem: From "Fix-on-Failure" to "Predict-and-Prevent" (5 mins)

*   **Problem Statement:** The cement industry faces increasing pressure to improve energy efficiency and sustainability. A significant challenge is the reliance on **reactive quality control**, where key indicators like free calcium oxide (f-CaO) are measured with significant time delays.
*   **The "Fix-on-Failure" Trap:** This delay leads to a "fix-on-failure" approach, causing systemic inefficiency, increased costs, and diminished performance.
*   **Our Vision:** Our goal is to shift this paradigm. We are building a Generative AI platform to move cement operations from a reactive model to a **proactive, "predict-and-prevent"** model, directly addressing the inefficiency caused by measurement time lags.

## 2. Prototype Walkthrough & Current Progress (20 mins)

This section will detail our current build and how it maps to the problem statement's required capabilities.

*   **Core Architecture:**
    *   **Data Fusion:** Using Google BigQuery to unify siloed plant data.
    *   **AI-Powered Core:** Leveraging Vertex AI for predictive modeling and Gemini for generative insights.
    *   **Interface:** A real-time dashboard built with React and hosted on Firebase.

*   **Data Sources:**
    *   **ML Model Data:** The data used to train our RandomForest model is synthetically generated.
        1.  `data_simulation/simulate_kiln_data.py` creates a CSV file with simulated kiln data.
        2.  This data is loaded into a BigQuery table.
        3.  `model_training/preprocess_data.py` fetches the data from BigQuery, preprocesses it, and saves it as `processed_kiln_data.csv`.
        4.  This processed data is then used to train the model.
    *   **Frontend Mock Data:** The data currently displayed in the frontend dashboard is **mock data** that is hardcoded in the backend at `backend_services/api.py`. This allows us to develop and showcase the UI independently of the ML model and live data pipeline.

*   **Current Progress:**
    *   **Frontend (`frontend_dashboard`):**
        *   A comprehensive and visually rich UI has been developed using React, TypeScript, and Material-UI.
        *   Key components are in place: `EnergyCockpit`, `KilnHealthOverview`, `PredictiveQualityDashboard`, `FlowDisplay`, and a `GeminiAIAssistant`.
        *   The frontend is currently populated with **mock data** from the backend.
    *   **Backend (`backend_services`):**
        *   A FastAPI backend has been created with endpoints for all major frontend components.
        *   The backend serves **mock data** and is not yet connected to BigQuery or the Vertex AI models.
        *   An endpoint for the LiveKit video call feature is implemented.
        *   A `/api/chat_inference` endpoint forwards requests to an external "CogniX ACP server".
    *   **Data & ML Pipeline:**
        *   Scripts for data simulation (`data_simulation`), preprocessing (`model_training/preprocess_data.py`), and model training (`model_training/train_clinker_model.py`) have been created.
        *   Simulated data has been loaded into BigQuery.
        *   A RandomForest model has been trained and deployed to a Vertex AI endpoint (`mlops/deploy_model_to_vertex_ai.py`).
    *   **Challenge:** The trained model has shown **poor performance** (negative R-squared), indicating it's not a good fit for the data. This is a major roadblock.

*   **Live Demo:** A brief showcase of the `frontend_dashboard` with the current mock data to demonstrate the user experience.

*   **Showcase: The Alert Flow**
    *   To demonstrate our "predict-and-prevent" vision, we will showcase a simulated alert flow.
    *   **Trigger:** A simulated high-temperature spike in the kiln.
    *   **Automated Response:**
        1.  The **`GeminiAIAssistant`** automatically opens, displaying a critical alert and a clear, actionable recommendation (e.g., "Reduce fuel rate").
        2.  The main dashboard view automatically switches to the **`Process Flow`**.
        3.  The specific node in the process flow where the anomaly is occurring (e.g., "Kiln Burning") is visually highlighted with a pulsing animation.
    *   **Guided Troubleshooting:** This flow immediately draws the operator's attention to the problem, its location, and the recommended solution, enabling a rapid and guided response. The operator can then use the conversational AI to drill down for more details (e.g., "Show me the kiln's health details").

*   **Vision & Progress Summary:**
    *   **Feature Status:**
        | Feature/Component | Status | Next Step |
        | :--- | :--- | :--- |
        | **Frontend UI** | Implemented | Connect to live backend data |
        | `EnergyCockpit` | Implemented (Mock Data) | Integrate with backend |
        | `KilnHealthOverview`| Implemented (Mock Data) | Integrate with backend |
        | `PredictiveQuality` | Implemented (Mock Data) | Integrate with backend |
        | `GeminiAIAssistant` | Implemented (Mock Chat) | Integrate with real AI agent |
        | **Backend API** | Implemented | Connect to BigQuery & Vertex AI |
        | **ML Model** | Deployed (Poor Performance) | Improve model accuracy |
        | **Data Pipeline** | Implemented | - |

    *   **Vision Demo Scenario (The "Golden Path"):**
        1.  **Proactive Alert:** The system detects a potential quality drop based on real-time data from the kiln.
        2.  **AI Intervention:** The `GeminiAIAssistant` opens with a message like: "I predict a 15% drop in clinker quality in the next hour. I recommend increasing the kiln speed by 0.2 RPM to stabilize the temperature."
        3.  **Guided Analysis:** The `PredictiveQualityDashboard` is automatically displayed, showing the predicted quality drop and the factors contributing to it.
        4.  **Operator Action:** The operator can either approve the AI's recommendation with a single click, or ask follow-up questions like "What is the current kiln speed?" or "Show me the temperature trend for the last 3 hours."
        5.  **Closed Loop:** Once approved, the system automatically adjusts the kiln speed, and the operator can monitor the real-time impact of the change on the dashboard.

## 3. Our Tech Stack (Aligning with Hackathon Rules) (5 mins)

*   **Confirmation of Google AI Tools:** We are building our prototype exclusively with the recommended Google Cloud technologies.
    *   **Gemini & Agent Builder:** For the core reasoning engine and our `GeminiAIAssistant` feature.
    *   **Vertex AI:** For training and deploying all predictive models.
    *   **BigQuery:** As the central data warehouse.
    *   **Firebase:** For hosting the real-time dashboard.
    *   **Gemma / Code Assist:** Used during development for code generation and optimization.

## 4. Key Questions & Areas for Feedback (15 mins)

We would love your expert guidance on the following points:

*   **AI/ML Strategy:** Our current RandomForest model is underperforming. What alternative modeling approaches or feature engineering techniques would you recommend for time-series data like this? (e.g., LSTMs, GRUs, or Transformer-based models as mentioned in our `docs/models.md`).
*   **Backend Integration:** What is the most efficient way to connect our FastAPI backend to BigQuery and the Vertex AI endpoint to serve live data to the frontend?
*   **Feature Prioritization:** Given the model performance issues, should we focus on improving the model or on building out more frontend features with mock data for the showcase?
*   **Potential Blind Spots:** What technical or presentation challenges should we be wary of as we prepare for Showcase Day?
*   **Wow Factor:** What could we add or emphasize to make our solution stand out to the jury, even with the current model limitations?

## 5. Roadmap to Showcase Day (5 mins)

*   **Current Status:** Frontend is well-developed but uses mock data. Backend is partially implemented but not connected to live data. The ML model is deployed but not performing well.
*   **Next 2 Weeks:**
    *   **Priority 1: Improve the ML Model.** Experiment with new models (e.g., LightGBM, LSTMs) and feature engineering (e.g., lag features) to improve predictive performance.
    *   **Priority 2: Backend Integration.** Connect the FastAPI backend to BigQuery to fetch and serve real data.
    *   **Priority 3: Frontend Integration.** Connect the frontend components to the live data from the backend.
    *   Incorporate feedback from this session.
    *   Prepare a compelling presentation and demo script that acknowledges the current challenges and focuses on the vision and architecture.

## 6. Open Discussion & Action Items (10 mins)

*   Open floor for general feedback and Q&A.
*   Summarize key takeaways and action items for our team.