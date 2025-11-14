// server.js (replace your current file)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import session from 'express-session';
import passport from 'passport';

import authRoutes from './Routes/authRoutes.js';
import profileRoutes from './Routes/profileRoutes.js';
import connectionRoutes from './Routes/connectionRoutes.js';
import chatRoutes from './Routes/chatRoutes.js';
import { initSocket } from './socket.js';
import './Utils/passport.js';

const app = express();
const PORT = process.env.PORT || 5000;

// EXACT allowed origins (no '*' when credentials: true)
const allowedOrigins = [
  'http://localhost:5173',
  'https://connectly-mu.vercel.app',
  'https://connectly-4pfl.onrender.com', // if you ever need the backend to call itself from frontend-like origin
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools (Postman)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight for all routes

// debug help — logs the incoming origin for failing requests
app.use((req, res, next) => {
  console.log('[CORS DEBUG] incoming origin:', req.headers.origin);
  next();
});

// If your app is behind a proxy (Render), enable trust proxy
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(express.json());

// session + passport
app.use(session({
  name: 'connectly.sid',
  secret: process.env.SESSION_SECRET || 'change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',                         // allow cross-site cookie from frontend domain
    secure: process.env.NODE_ENV === 'production', // requires HTTPS in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', chatRoutes);

// create server & init socket with same origins
const server = http.createServer(app);
initSocket(server, allowedOrigins);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
