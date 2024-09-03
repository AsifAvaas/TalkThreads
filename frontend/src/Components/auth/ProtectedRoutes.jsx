import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import isAuthenticated from "./isAuthenticated";

const ProtectedRoutes = ({ children }) => {
  const [auth, setAuth] = useState("");
  const navigate = useNavigate();
  const checkAuth = async () => {
    const authStatus = await isAuthenticated();
    if (authStatus) {
      console.log("user is authenticated");
    } else {
      console.log("user is not authenticated");
      localStorage.clear();
    }
    setAuth(authStatus);
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return auth ? children : navigate("/user/login");
};

export default ProtectedRoutes;
