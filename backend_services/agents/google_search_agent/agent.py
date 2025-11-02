import asyncio
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

load_dotenv()

root_agent = Agent(
   # A unique name for the agent.
   name="basic_search_agent",
   # The Large Language Model (LLM) that agent will use.
   # Please fill in the latest model id that supports live from
   # https://google.github.io/adk-docs/get-started/streaming/quickstart-streaming/#supported-models
   model="gemini-2.5-pro",  # for example: model="gemini-1.5-flash-preview-05-14" or model="gemini-1.5-pro-preview-05-14"
   # A short description of the agent's purpose.
   description="Agent to answer questions using Google Search.",
   # Instructions to set the agent's behavior.
   instruction="You are an expert researcher. You always stick to the facts.",
   # Add google_search tool to perform grounding with Google search.
   tools=[google_search]
)

session_service = InMemorySessionService()
runner = Runner(
    app_name="basic_search_agent",
    agent=root_agent, 
    session_service=session_service
)


async def get_google_search_response(question: str) -> str:

    session = await session_service.create_session(
    app_name="basic_search_agent", user_id="user_123"
    )
    
    message = types.Content(role="user", parts=[types.Part(text=question)])

    async for event in runner.run_async(session_id=session.id, new_message=message, user_id="user_123"):
        if event.is_final_response:
            return event.content.parts[0].text

async def main():
    question = "What is the weather in London?"
    print(f"Question: {question}")
    answer = await get_google_search_response(question)
    print(f"Answer: {answer}")

if __name__ == "__main__":
    asyncio.run(main())