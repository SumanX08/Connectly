// src/config.js
export const API_URL =
  import.meta.env.REACT_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://your-backend.onrender.com");
