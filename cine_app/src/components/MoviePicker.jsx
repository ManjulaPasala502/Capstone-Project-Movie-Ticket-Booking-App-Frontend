import React from "react";

const MoviePicker = ({ movies, onSelect }) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p>No movies available.</p>;
  }

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="p-2 border rounded w-full"
    >
      <option value="">Select Movie</option>
      {movies.map((movie) => (
        <option key={movie._id} value={movie._id}>
          {movie.title}
        </option>
      ))}
    </select>
  );
};

export default MoviePicker;
