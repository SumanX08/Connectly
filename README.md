# Connectly – Skill-Based Networking Platform

##  About the Project
**Connectly** is a skill-based networking platform that helps users build meaningful connections based on their skills and interests.  
Built with the **MERN stack**, it combines a modern UI with real-time features to deliver a seamless networking experience.

---

##  Features
-  **Authentication with Auth0** – Secure signup/login  
-  **Swipe Interface** – Connect/Skip interactions like modern networking apps  
-  **Real-time Chat** – Powered by Socket.IO  
-  **Smart Filters** – Search users by skills, location, and age range  
-  **Notifications & Connect Requests** – Stay updated with requests in real-time  
-  **Responsive UI** – Built with React + Tailwind  

---

##  Tech Stack
**Frontend:** React, Tailwind CSS, Zustand, Framer Motion  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** Auth0  
**Real-time:** Socket.IO  

---

##  Demo
 **Live Demo:** https://connect-ly-app.vercel.app


---

##  Installation & Setup Guide  

Follow these steps to run **Connectly** locally on your machine.  

```bash
# 1️ Clone the Repository
git clone https://github.com/SumanX08/connectly.git
cd connectly

# 2️ Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# 3️ Set Up Environment Variables
# Create a file at: /backend/.env
PORT=5000
MONGO_URI=your-mongodb-uri
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
SOCKET_PORT=5001

# Create a file at: /frontend/.env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5001

# 4️ Run the Development Servers
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# 5️ Open in Browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
