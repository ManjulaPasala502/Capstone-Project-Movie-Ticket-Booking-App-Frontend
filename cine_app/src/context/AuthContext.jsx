// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on initial load
  useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user");
  }
}, []);

  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const signup = async (data) => {
    try {
    const res = await api.post("/auth/signup", data);
    toast.success(res.data.msg || "Registration successful");
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
    throw error;
  }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out");
  };
  const googleLogin = (googleUser) => {
    // optional: send googleUser to your backend or just store locally
    localStorage.setItem("user", JSON.stringify(googleUser));
    setUser(googleUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout,setUser,googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider