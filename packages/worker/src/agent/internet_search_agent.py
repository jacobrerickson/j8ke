import json
import re
import os
import logging
from typing import Any, Dict
from langchain_openai import ChatOpenAI # type: ignore
from langgraph.prebuilt import create_react_agent # type: ignore
from langgraph.checkpoint.memory import MemorySaver # type: ignore
from langchain_core.tools import tool # type: ignore
from openai import OpenAI # type: ignore    
from dotenv import load_dotenv # type: ignore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InternetSearchAgent:
    def __init__(self):
        """Initialize the Internet Search Agent with necessary configurations."""
        load_dotenv()
        self.agent = self._create_agent()

    @staticmethod
    def clean_agent_code(content: str) -> str:
        """Clean generated agent code by removing markdown and JSON formatting."""
        # Extract content between ```python and ``` markers
        if "```python" in content and "```" in content:
            start = content.find("```python") + len("```python")
            end = content.find("```", start)
            if end != -1:
                return content[start:end].strip()
        # Remove ```json blocks
        cleaned = re.sub(r'```json[\s\S]*?```', '', content)
        # Remove ```python blocks
        cleaned = re.sub(r'```python\s*\n', '', cleaned)
        cleaned = re.sub(r'\n\s*```\s*$', '', cleaned)
        # Remove any remaining code blocks
        cleaned = re.sub(r'```[\s\S]*?```', '', cleaned)
        # Remove extra newlines
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        return cleaned.strip()

    @staticmethod
    @tool
    def internet_search(query: str) -> Dict[str, Any]:
        """
        Perform an internet search using Perplexity and return structured results.
        
        Args:
            query: The search query    
        Returns:
            Dict containing search results and metadata
        """
        try:
            logger.info(f"Performing internet search for: {query}")

            key = os.getenv("PERPLEXITY_API_KEY")
            print("Perplexity API Key:", key)
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that can search the internet for information."
                    )
                },
                {
                    "role": "user",
                    "content": f"Please provide an answer to this: {query}"
                },
            ]
            client = OpenAI(api_key=key, base_url="https://api.perplexity.ai")
            response = client.chat.completions.create(
                    model="sonar-pro",  # Use the documented model name
                    messages=messages,
                )
            response_content = response.choices[0].message.content
            return {
                "query": query,
                "response": response_content,
                "status": "success"
            }
        except Exception as e:
            logger.error(f"Error during internet search: {e}")
            return {
                "query": query,
                "error": str(e),
                "error_type": type(e).__name__,
                "status": "error"
            }

    def _create_agent(self):
        """Create a React agent with the specified tools."""
        chat = ChatOpenAI(temperature=0, model="gpt-4o")

        system_prompt = """
        You are a helpful assistant that can use the following tools to help the user:
        - internet_search

        You can use the internet_search tool to search the internet for information.
        """

        tools = [
            self.internet_search,
        ]
        return create_react_agent(
            model=chat,
            tools=tools,
            prompt=system_prompt,
            checkpointer=MemorySaver(),
        )

    def search(self, query: str) -> Dict[str, Any]:
        """
        Perform an internet search using the configured agent.
        
        Args:
            query: The search query to process
            
        Returns:
            Dict containing the search results and any relevant metadata
        """
        config = {
            "configurable": {
                "thread_id": 42,
                "recursion_limit": 25
            }
        }
        try:
            result = self.agent.invoke({"messages": [query]}, config=config)
            return {
                "query": query,
                "result": result,
                "status": "success"
            }
        except Exception as e:
            raise ValueError(f"Error during agent search: {e}")

# Example usage when run directly
if __name__ == "__main__":
    agent = InternetSearchAgent()
    user_input = input("Enter a message: ")
    result = agent.search(user_input)
    print(result)