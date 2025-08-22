import {io } from "socket.io-client"
import { API_URL } from "./config";

const URL = `${API_URL}`;
const token = localStorage.getItem("token")

export const socket = io(URL, {
  autoConnect: false, 
  auth: {
    token,   
  },
});