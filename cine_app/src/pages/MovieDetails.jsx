import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Star } from "lucide-react";
import ReactPlayer from "react-player";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data.data);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 md:px-16 py-8 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Movie Poster */}
        <img
          src={movie.poster?.startsWith("http") ? movie.poster : `http://localhost:3000/${movie.poster}`}
          alt={movie.title}
          className="rounded-lg w-full md:w-1/3 max-h-96 object-cover"
        />

        {/* Movie Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          {movie.description && <p className="mt-2 text-gray-300">{movie.description}</p>}

          <div className="mt-4 flex items-center gap-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>{movie.rating}/10</span>
            <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Rate Now
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <p><strong>Language:</strong> {movie.language}</p>
            <p><strong>Duration:</strong> {movie.duration}</p>
            <p><strong>Genres:</strong> {movie.genres?.join(", ")}</p>
          </div>

          <div className="mt-4">
            <p className="mt-2">
              <strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}
            </p>

            {movie.shows && movie.shows.length > 0 ? (
              <button
                className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition cursor-pointer"
                onClick={() => navigate(`/seat-layout/${movie.shows[0]._id}`)}
              >
                Book Tickets
              </button>
            ) : (
              <p className="mt-4 text-gray-400 font-semibold">No shows available for this movie.</p>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {movie.trailer && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={movie.trailer}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
