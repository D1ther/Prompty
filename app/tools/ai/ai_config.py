from openai import OpenAI
from dotenv import load_dotenv

import os

load_dotenv()
AI_KEY = os.getenv("AI_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=AI_KEY
)

