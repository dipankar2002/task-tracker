# ✅ Task Tracker

A full-stack web application to manage personal projects and tasks with authentication and modern UI.

---

## 🔗 Live Demo

[https://task-tracker-client-4j5d.onrender.com] *(replace with your actual deployment URL)*

---

## 🚀 Features

### ✅ Project & Task Management
- User Signup and Login (JWT-based)
- Each user can create up to 4 projects
- Add, edit, delete tasks inside each project
- Task fields: title, description, status, creation and completion dates

### 🌐 Clean & simple Responsive UI
- Built with React and Tailwind CSS
- Zustand for global state management
- Axios for API communication
- Form validation with Zod

---

## 🛠️ Tech Stack

| Frontend             | Backend          | Database      |
|----------------------|------------------|---------------|
| React, Tailwind CSS  | Node.js, Express | MongoDB Atlas |
| Zustand, Axios       | JWT Auth         | Mongoose      |

---

## Installation

Follow these steps to set up the project locally:

### Step 1: Clone the Repository

git clone https://github.com/yourusername/task-tracker-app.git
cd task-tracker-app

### Step 2: Install Dependencies

npm install

### Step 3: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add a user and whitelist your IP
4. Create a database (e.g., finance)
5. Copy your MongoDB connection URI

It looks like:

mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance?retryWrites=true&w=majority

### Step 4: Configure Environment Variables

Create a file called `.env` in the root of the project:

PORT=3000
MONGO_URI=your-mongodb-uri-here
TOKEN_SECRET=your-jsonwebtoken-secret-key-here
NODE_ENV=development 

> Make sure this file is NOT pushed to GitHub.

### Step 5: Start the Development Server

npm run dev

backend

cd server
npm start

frontend

cd ../client
npm run dev

Then visit: http://localhost:5173

---