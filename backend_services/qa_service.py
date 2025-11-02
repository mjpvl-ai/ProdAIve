from backend_services.agents.google_search_agent.agent import get_response as get_agent_response

def get_response(question: str) -> str:
    """
    This function takes a question as input and returns a response.

    Args:
        question: The question to be answered.

    Returns:
        The answer to the question.
    """
    return get_agent_response(question)
