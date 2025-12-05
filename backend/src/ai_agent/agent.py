# backend/src/ai_agent/agent.py
import httpx
import os
from fastapi import HTTPException

# Get Gemini API key from .env

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set in .env.")

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

async def get_gemini_response(chat_history: list) -> str:
    """
    Sends chat history to the Gemini API and returns the model's text response.
    """
    gemini_payload = {
        "contents": chat_history,
        "generationConfig": {
            
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            gemini_response = await client.post(
                GEMINI_API_URL,
                json=gemini_payload,
                timeout=30.0 
            )
            gemini_response.raise_for_status() 
            gemini_result = gemini_response.json()

            
            if gemini_result.get("candidates") and gemini_result["candidates"][0].get("content") and \
               gemini_result["candidates"][0]["content"].get("parts") and \
               gemini_result["candidates"][0]["content"]["parts"][0].get("text"):
                response_text = gemini_result["candidates"][0]["content"]["parts"][0]["text"]
                return response_text
            else:
                print(f"Gemini API returned unexpected structure: {gemini_result}")
                raise HTTPException(status_code=500, detail="Gemini API returned an unexpected response structure.")

        except httpx.HTTPStatusError as e:
            print(f"HTTP error from Gemini API: {e.response.status_code} - {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"Gemini API error: {e.response.text}")
        except httpx.RequestError as e:
            print(f"Network error when calling Gemini API: {e}")
            raise HTTPException(status_code=500, detail=f"Network error when connecting to Gemini API: {e}")
        except Exception as e:
            print(f"Unexpected error in get_gemini_response: {e}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred in the AI agent: {e}")
