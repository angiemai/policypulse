1. Prerequisites

Before you start, make sure the following have been installed:

    Python 3.13 and pip: For the backend.

    Node.js and npm: For the frontend.

    uv: A modern and fast Python package installer. You can install it with pip install uv.
2. Backend Setup

This section will help you configure and run the FastAPI backend.

    Navigate to the backend directory:

    cd backend

    Create a virtual environment:

    python3.13 -m venv .venv

    Activate the virtual environment:

        macOS/Linux:

        source .venv/bin/activate

        Windows:

        .\.venv\Scripts\activate

    Install dependencies: This command reads your pyproject.toml file and installs all the required packages.

    pip install -r requirements.txt

    Create a .env file: Your backend requires an API key and other configuration. Create a file named .env in the backend directory and add your key - for example:

    GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"

    Run the backend server:

    uvicorn app:app --reload

    The backend API will be available at http://127.0.0.1:8000.

3. Frontend Setup

This section covers the setup for your React frontend.

    Open a new terminal and navigate to the frontend directory:

    cd frontend

    Install dependencies:

    npm install

    Start the development server:

    npm run dev

    Your frontend application will be available at http://localhost:5173.



    When running on EC2
    sudo uvicorn app:app --host 0.0.0.0 --port 8000

    http://54.210.123.45:8000


    Frontend
    npm run dev -- --host 0.0.0.0 --port 3000

    http://16.171.14.0:3000