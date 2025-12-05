# backend/app.py
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import Dict, List, Any, Optional
from src.saving_doc.coverage_evaluator_AI import get_perplexity_response
from src.saving_doc.Saving_documents import collectionEditedDoc, Doc, collectionNotifications, Notification
from datetime import datetime
load_dotenv()
from src.calculator.calculations import calculate_company_impact
from src.ai_agent.agent import get_gemini_response
from bson import ObjectId

# Define your directories and collection names based on your .env file
DEFAULT_DOCS_DIRECTORY = os.getenv("DEFAULT_DOCS_DIRECTORY")
NEW_FILES_DESTINATION = os.getenv("NEW_FILES_DESTINATION")
DEFAULT_COLLECTION = os.getenv("MONGODB_DEFAULT_DB_NAME", "default_docs")
CUSTOM_COLLECTION = os.getenv("MONGODB_CUSTOM_DB_NAME", "custom_docs")

# Load Pinecone API key and index name
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "test2")

if not PINECONE_API_KEY:
    print("WARNING: PINECONE_API_KEY environment variable not set. Document embedding will not work.")
if not PINECONE_INDEX_NAME:
    print("WARNING: PINECONE_INDEX_NAME environment variable not set.")


app = FastAPI(
    title="Policy Pulse: Agentic AI Backend API",
    description="""
    This API serves as the intelligent backend for the Policy Pulse application,
    featuring an **Agentic AI** powered by **Google Gemini**.

    It provides core functionalities including:
    - **Intelligent Chatbot:** An AI Agent capable of engaging in natural language conversations,
      maintaining context, and providing relevant responses.
    - **Policy Impact Calculator:** A tool to estimate the financial impact and ROI of
      various health policies within an organization.
    - **Document Processor:** A tool to process and embed policy documents into a vector database.

    Designed for seamless integration with the Policy Pulse frontend, enabling dynamic and
    responsive user interactions.
    """,
    version="1.0.0",
    terms_of_service="INSERT TERMS OF SERVICE URL (WIX) HERE",
    contact={
        # Add contact info here if desired
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

origins = ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:8000/my-saved-policies"]
# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def read_root():
    """
    Root endpoint for a simple health check.
    """
    return {"message": "Backend is running!"}

# --- AI Agent Endpoints (Existing) ---

class ChatRequest(BaseModel):
    chat_history: list

@app.post("/chat")
async def chat_proxy(request_body: ChatRequest):
    """
    Proxies chat requests to the Gemini API using the ai_agent module.
    """
    print(f"Received chat request from frontend: {request_body.chat_history}")

    try:
        response_text = await get_gemini_response(request_body.chat_history)
        return {"response_text": response_text}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error in chat proxy: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred in the chat proxy: {e}")


# --- Policy Impact Calculator Endpoints---

class PolicyCalculationRequest(BaseModel):
    companyName: str
    country: str
    numberOfEmployees: int
    policies: Dict[str, bool]
    avgSalary: float = 42000

class PolicyCalculationResponse(BaseModel):
    companyName: str
    totalEmployees: int
    femaleEmployees: int
    maleEmployees: int
    avgSalary: float
    policiesSelected: Dict[str, bool]
    employeeBreakdown: Dict[str, Any]
    currentCosts: Dict[str, Any]
    investmentAnalysis: Dict[str, Any]
    roiAnalysis: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    annualCostPerEmployee: float
    snapshotSummary: str
    totalAnnualCost: str

@app.post("/calculate_policy_impact", response_model=PolicyCalculationResponse)
async def calculate_policy_impact_endpoint(request: PolicyCalculationRequest):
    """
    API endpoint to calculate the company-wide policy impact based on selected policies.
    """
    print(f"Received policy impact calculation request for company: {request.companyName}")
    try:
        results = calculate_company_impact(request.dict())
        results['totalAnnualCost'] = f"£{results['currentCosts']['total']:,.0f}"

        print(f"DEBUG: Policy calculation successful for {request.companyName}")
        return PolicyCalculationResponse(**results)
    except Exception as e:
        print(f"DEBUG: Error during policy calculation for {request.companyName}: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@app.post("/coverage_evaluator")
async def suggest_text(request: Request):
    body = await request.json()
    text = body.get("text","")
    return await get_perplexity_response(text)

@app.post("/saved-docs/") #TO SAVE DOCUMENTS IN MONGODB
async def save_doc(document: Doc):
    #Convert the Pydantic model into a python dictionary
    doc_dict = document.dict()

    #To UPDATE
    if doc_dict["docId"]:
        try:
            obj_id = ObjectId(doc_dict["docId"])
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid ObjectId format")

        doc_dict["LastUpdatedAt"]=datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        result = collectionEditedDoc.replace_one({"_id": obj_id}, doc_dict, upsert=True)

    else:
        doc_dict["CreatedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        doc_dict["LastUpdatedAt"] = doc_dict["CreatedAt"]
        collectionEditedDoc.insert_one(doc_dict)
    #collection.update_one(doc_dict) NOT EXACTLY THE SAME
    return {"message": "Document received in backend"}

@app.post("/notifications")
async def notifications(notif: Notification):
    doc_dict = notif.dict()
    collectionNotifications.insert_one(doc_dict)
    return{"message": "Document received in backend"}

@app.get("/my-saved-policies") #TODO: sort them in ascending or descending order depending on updated time
def get_docs_for_list ():
    info = []
    for doc in collectionEditedDoc.find():
        new_doc = {k: v for k, v in doc.items() if k != 'content' and k!='userId' and k!="CreatedAt"}
        new_doc["_id"] = str(new_doc["_id"])
        info.append(new_doc)
    if info:
        print(info)
        return info
    else:
        raise HTTPException(status_code=404, detail="Document not found")

@app.get("/edit-document/{policyId}")
def get_doc_to_edit(policyId:str):
    try:
        obj_id = ObjectId(policyId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    doc = collectionEditedDoc.find_one({"_id": obj_id})
    del doc["_id"]
    if doc:
        return doc
    else:
        raise HTTPException(status_code=404, detail="Document not found")

@app.get("notifications")
def get_notifications():
    notif=[]
    for doc in collectionNotifications.find():
        new_doc = {k: v for k, v in doc.items() if k != 'content' and k != 'userId' and k != "CreatedAt"}
        new_doc["_id"] = str(new_doc["_id"])
        notif.append(new_doc)
    if notif:
        print(notif)
        return notif
    else:
        raise HTTPException(status_code=404, detail="Document not found")

@app.get("/documents")
def get_documents(collection_name:str):
    print(f"Received documents for {collection_name}")


