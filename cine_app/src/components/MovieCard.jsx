import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full h-[300px]">
      {/* Movie Poster */}
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={movie.poster} // Use full HTTPS URL from backend
        alt={movie.title}
        className="rounded-lg h-48 w-full object-cover cursor-pointer"
      />

      {/* Movie Info */}
      <p className="font-semibold text-white text-sm truncate">{movie.title}</p>
      <p className="text-xs text-gray-400 mt-1 truncate">
        {movie.genres?.slice(0, 2).join(" | ")}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-3 py-1 bg-pink-600 text-white text-sm rounded-full hover:bg-pink-700 transition"
        >
          Book Now
        </button>

        {movie.rating > 0 && (
          <p className="flex items-center gap-1 text-xs text-gray-300">
            <Star className="w-3 h-3 text-yellow-400" />
            {movie.rating.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
