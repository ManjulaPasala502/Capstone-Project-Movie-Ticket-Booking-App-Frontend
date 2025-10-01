import API from "./api";
import axios from "axios";  // <-- add this


// Create a new show
export const createShow = async (showData) => {
  const token = localStorage.getItem("token");
  const response = await API.post("/shows", showData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyShows = async () => {
  try {
    const res = await API.get("/shows/my"); // axios instance attaches token
    return res.data;
  } catch (err) {
    console.error("Error fetching my shows:", err);
    throw err;
  }
};
// Get all shows
export const getShows = async () => {
  const response = await API.get("/shows");
  return response.data;
};

// Get show by ID
export const getShowById = async (id) => {
  const response = await API.get(`/shows/${id}`);
  return response.data;
};

// Update a show
export const updateShow = async (id, showData) => {
  const token = localStorage.getItem("token");
  const response = await API.put(`/shows/${id}`, showData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a show
export const deleteShow = async (id) => {
  const token = localStorage.getItem("token");
  const response = await API.delete(`/shows/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get shows by movie ID
export const getShowsByMovieId = async (movieId) => {
  const response = await API.get(`/shows/movie/${movieId}`);
  return response.data;
};

