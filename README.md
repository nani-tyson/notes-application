# Notes Taking Application

This repository contains a full-stack Notes Taking Application with separate **backend** and **frontend** folders.  

---

## Project Structure

notes-taking-application/
├── backend/ # Node.js + Express backend
├── frontend/ # React + Vite frontend
└── README.md

yaml
Copy code

---

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
2. Install dependencies
bash
Copy code
npm install
3. Create .env file
Create a .env file in backend/ folder with the following content:

env
Copy code
PORT=3000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
4. Run the backend
bash
Copy code
npm start
The backend server will run at:

arduino
Copy code
http://localhost:3000
Frontend Setup
1. Navigate to frontend folder
bash
Copy code
cd frontend
2. Install dependencies
bash
Copy code
npm install
3. Create .env file
Create a .env file in frontend/ folder with the following content:

env
Copy code
VITE_API_BASE_URL=http://localhost:3000/api
4. Run the frontend
bash
Copy code
npm run dev
The frontend will run at:

arduino
Copy code
http://localhost:5173
The port may vary depending on Vite’s default settings.

Usage
Start the backend server first.

Then start the frontend server.

Open the frontend URL in your browser.

You can now register, login, and manage your notes.

Environment Variables Summary
Backend
PORT — port number for backend server

MONGODB_URI — MongoDB connection string

JWT_SECRET — secret key for JWT authentication

EMAIL_USER — email for sending notifications

EMAIL_PASS — password for the email account

Frontend
VITE_API_BASE_URL — base URL for backend API endpoints





Ask ChatGPT
