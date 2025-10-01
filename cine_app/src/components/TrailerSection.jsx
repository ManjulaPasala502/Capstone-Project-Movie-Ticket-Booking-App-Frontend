import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { fetchMovies } from "../services/movieService";

const TrailerSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetchMovies();
        const allMovies = res.data?.data || res.data || [];
        const trailers = allMovies.filter((movie) => movie.trailer);
        setMovies(trailers);

        if (trailers.length) setCurrentTrailer(trailers[0].trailer); // autoplay first trailer
      } catch (err) {
        console.error("Failed to load movies", err);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  const handleThumbnailClick = (trailerUrl) => {
    // Safely switch trailers
    setPlaying(false); // stop current trailer
    setCurrentTrailer(trailerUrl); // set new trailer
    setTimeout(() => setPlaying(true), 100); // autoplay new trailer
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Loading trailers...</p>;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-gray-900 text-white">
      <p className="text-pink-700 font-medium text-lg max-w-[960px] mx-auto">
        🎬 Trailers
      </p>

      {/* Main Trailer */}
      {currentTrailer && (
        <div className="relative mt-6 pt-[56.25%]">
          <ReactPlayer
            url={currentTrailer}
            controls
            playing={playing}
            muted
            width="100%"
            height="100%"
            className="absolute top-0 left-0 rounded-lg"
            config={{
              youtube: { playerVars: { rel: 0, showinfo: 0, modestbranding: 1 } },
            }}
          />
        </div>
      )}

      {/* Trailer Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        {movies.map((movie) => (
          <div
            key={movie._id}
            role="button"
            tabIndex={0}
            onClick={() => handleThumbnailClick(movie.trailer)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleThumbnailClick(movie.trailer)
            }
            className="relative cursor-pointer hover:scale-105 transition"
          >
            <img
              src={
                movie.poster
                  ? movie.poster.startsWith("http")
                    ? movie.poster
                    : `http://localhost:3000/${movie.poster}`
                  : "/fallback.jpg"
              }
              alt={movie.title}
              className="rounded-lg w-full h-40 object-cover"
            />
            <p className="text-center mt-2 text-sm text-pink-700 font-semibold">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;
