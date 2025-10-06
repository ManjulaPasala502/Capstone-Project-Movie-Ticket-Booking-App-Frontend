// src/utils/imageHelper.js
export const getImageUrl = (path) => {
  const backendURL = "https://capstone-project-movie-ticket-booking.onrender.com";

  if (!path) return ""; // fallback if no image
  // If path starts with http(s), return as is, else prepend backend URL
  return path.startsWith("http") ? path : `${backendURL}/${path.replace(/^\/+/, "")}`;
};
