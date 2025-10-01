import React, { useEffect, useState } from "react";
import { fetchMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetchMovies();
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading movies...</p>;

  return (
    <div className="px-4 md:px-16 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">All Movies</h1>
      {movies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} posterHeight="h-64" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
