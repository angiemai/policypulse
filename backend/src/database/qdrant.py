from langchain_community.vectorstores import Qdrant
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.documment_loaders import WebBaseLoader

from qdrant_client import QdrantClient, models
import os
from dotenv import load_dotenv

load_dotenv()

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

vector_store = Qdrant(
    client=client,
    collection_name=collection_name,
    embedding=GoogleGenerativeAIEmbeddings(
        QDRANT_API_KEY,
    )
)
def create_qdrant_vector_store(collection_name: str):
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=1536, 
            distance=models.Distance.COSINE
        )
    )
    print(f"Collection '{collection_name}' created successfully.")
    
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)      

def upload_website_to_collection(url:str):
    loader = WebBaseLoader(url)
    docs = loader.load_and_split(text_splitter)
    for document in docs:
        document.metadata = {"source": url}
        
    vector_store.add_documents(docs)
    print(f"Documents from {url} added to collection '{collection_name}'.")

create_qdrant_vector_store(collection_name)
upload_website_to_collection("http://hamel.dev/blog/posts/evals")