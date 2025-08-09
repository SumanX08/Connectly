import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../Stores/useAuthStore";



const  ProtectedRoutes=  ({children})=> {
 const {isAuthenticated}=useAuthStore()
 return isAuthenticated?children:<Navigate to="/login"/>
}

export default ProtectedRoutes