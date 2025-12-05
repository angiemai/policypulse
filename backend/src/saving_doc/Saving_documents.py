from fastapi import FastAPI, HTTPException, requests
from jupyterlab.extensions import ActionResult
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec, SearchQuery
from dotenv import load_dotenv
import os
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from typing import Dict, Any, Optional
from starlette.middleware.cors import CORSMiddleware
from bson.json_util import dumps


load_dotenv()
#So that backend allows frontend to access it
from fastapi.middleware.cors import CORSMiddleware

uri = os.getenv('MONGODB_URI')
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
collectionEditedDoc = client["Policies"]["Edited_Doc"]
collectionNotifications = client["Policies"]["Notifications"]

class Doc(BaseModel):  # creating a JSON class where the editor content can be inputted
    docId: Optional[str] = None
    name: str = "Untitled"
    status: str = "Draft"
    content: Dict[str, Any]
    CreatedAt: str = None
    version: str ="0.08"
    userId: str = "A_number"

class Notification(BaseModel):
    category: str ="sysUpdate"
    title:str
    content:str
    time:str
    isDeleted: bool = False

