import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import profileRoutes from './Routes/profileRoutes.js';      
import connectionRoutes from './Routes/connectionRoutes.js';
import chatRoutes from './Routes/chatRoutes.js'
import http from "http"
import {initSocket} from "./socket.js"
import './Utils/passport.js'
import session from 'express-session'
import passport from 'passport';

const allowedOrigins = [
  "http://localhost:5173", 
  "https://connectly-mu.vercel.app/", 
];


const app = express();
const PORT = 5000; 

const server = http.createServer(app);
initSocket(server, allowedOrigins);


dotenv.config();

app.use(session({secret:'secret',resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages',chatRoutes)



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    ('MongoDB Connected');
    server.listen(PORT, () => (`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Connection Error:', err));
