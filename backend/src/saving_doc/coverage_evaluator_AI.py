import os
import httpx
from fastapi import FastAPI, HTTPException,Request,Response
from pinecone import Pinecone, ServerlessSpec, SearchQuery
from dotenv import load_dotenv

load_dotenv()
#Connecting to Perplexity and PinceCone
sonar_key = os.getenv("SONAR_API_KEY")
pc_api_key = os.getenv("PINECONE_API_KEY")

def extract_topic_from_pinecone(top_k, api_key = pc_api_key, index_name ="test"):
    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    # Define the query
    query = f"List the top {top_k} key topics and themes found in workplace reproductive health and fertility policy documents"

    response = index.search(
        namespace="Policy",
        query=SearchQuery(
            top_k= top_k,
            inputs={'text': query}
        ))

    topics = []
    for hit in response["result"][
        "hits"]:  # or could've written hits= results["results"]["hits"] and done for hit in hits
        topics.append(hit['fields']['text'])
    return topics

async def get_perplexity_response(text: str):
    print("Received text from frontend:", text)

    topics = extract_topic_from_pinecone(6)
    topic_list = "\n".join(f"- {t}" for t in topics)

    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {sonar_key}",
        "Content-Type": "application/json"}

    system_prompt = (f"""You are an expert compliance and policy coverage evaluator.
     Your job is to review a workplace policy document and determine if it fully, partially, or insufficiently addresses the information stored in {topic_list}.

     INSTRUCTIONS:
     -Carefully read the provided document
    - For each required topic, evaluate whether it is:
        • Fully Covered: Clearly and thoroughly addressed.
        • Partially Covered: Mentioned briefly or vaguely.
        • Missing: Not addressed at all.
    -Provide a summary of any **missing** or **inadequately covered** information/topic.
    - Be strict. If a topic/information is only implied or too vague, count it as "Partially Covered" or "missing".
    - Do not hallucinate. If there is something you don't know, tell the user you do not have enough information.
    -Only use the information provided in {topic_list}. Do not use information taking from the internet or other sources. NEVER.

    SOURCE: 
    {topic_list}

           RESPONSE FORMAT:
           1. Name of topic 1: [Status] - [summary]
           2. Name of topic 2: ...
           3. ...

            NOTE: Only provide a summary if not *fully covered*

            Summary of Missing or Inadequate Areas:
    [Bullet points explaining what should be added to fully comply + [source].
    Example: brief summary [section 3.2] ]
    """)

    payload = {
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Evaluate this document: {text}"},
        ],
        "max_tokens": 250,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()  # Raise error for non-200 responses
        except httpx.HTTPError as http_err:
            print("HTTP error when calling Perplexity:", http_err)
            raise HTTPException(status_code=500, detail="Failed to contact Perplexity API")

        try:
            response_json = response.json()
        except Exception as json_err:
            print("Failed to parse Perplexity JSON:", json_err)
            print("Raw response text:", response.text)
            raise HTTPException(status_code=500, detail="Response from Perplexity was not valid JSON")
        try:
            if response_json.get("choices") and response_json["choices"][0].get("message") and \
                    response_json["choices"][0]["message"].get(
                        "content"):  # The backslash tells python that the condition continues on the next line
                answer = response_json["choices"][0]["message"]["content"]
                print("Suggestion to send:", answer.strip())
                return {"suggestion": answer.strip()}  # Clean whitespace from both ends
        except Exception as err:
            print("Error parsing the AI response:", err)
            print("Raw response JSON", response_json)
            raise HTTPException(status_code=500, detail="Unexpected error while handling AI response")
        else:
            print("Unexpected structure in Perplexity response:", response_json)
            raise HTTPException(status_code=500, detail="Perplexity API returned unexpected structure")
