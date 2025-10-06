// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://capstone-project-movie-ticket-booking.onrender.com/api",
});

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error logging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// CRUD 
export const getMovies = () => API.get("/movies");
export const addMovie = (data) => API.post("/movies", data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

export default API;
