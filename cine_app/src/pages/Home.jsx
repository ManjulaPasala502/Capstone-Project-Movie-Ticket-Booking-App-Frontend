import React, { useState, useEffect } from "react";
import { fetchMovies } from "../services/movieService";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import TrailerSection from "../components/TrailerSection";
import { Filter } from "lucide-react";

const languages = ["All", "Telugu", "Hindi", "English", "Tamil", "Malayalam", "Kannada"];
const genres = ["All", "Action", "Drama", "Comedy", "Horror", "Romance", "Thriller"];

const Home = ({ searchValue = "" }) => {
  const navigate = useNavigate();
  const [moviesData, setMoviesData] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState(["All"]);
  const [selectedGenres, setSelectedGenres] = useState(["All"]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetchMovies();
        setMoviesData(res.data); // assuming backend sends { success, data }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    getMovies();
  }, []);

  const handleLanguageChange = (lang) => {
    if (lang === "All") return setSelectedLanguages(["All"]);
    setSelectedLanguages((prev) => {
      const updated = prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev.filter((l) => l !== "All"), lang];
      return updated.length ? updated : ["All"];
    });
  };

  const handleGenreChange = (genre) => {
    if (genre === "All") return setSelectedGenres(["All"]);
    setSelectedGenres((prev) => {
      const updated = prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev.filter((g) => g !== "All"), genre];
      return updated.length ? updated : ["All"];
    });
  };

  const filteredMovies = moviesData.filter((movie) => {
    const langMatch = selectedLanguages.includes("All") || selectedLanguages.includes(movie.language);
    const movieGenres = Array.isArray(movie.genres) ? movie.genres : movie.genre ? [movie.genre] : [];
    const genreMatch = selectedGenres.includes("All") || movieGenres.some((g) => selectedGenres.includes(g));
    const searchMatch = movie.title.toLowerCase().includes(searchValue.toLowerCase());
    return langMatch && genreMatch && searchMatch;
  });

  const homeMovies = filteredMovies.slice(0, 8);

  return (
    <div className="px-4 md:px-8 py-6 space-y-10 bg-gray-100 min-h-screen">

      {/* Mobile Filter Button */}
      <div className="flex justify-end md:hidden mb-4">
        <button
          className="flex items-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar Filters */}
        <aside className={`w-full md:w-1/4 space-y-6 bg-white p-4 rounded shadow
          ${showMobileFilters ? "block mb-6" : "hidden md:block"}`}
        >
          <div>
            <h2 className="text-xl font-bold text-pink-700 mb-2">Languages</h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <label key={lang} className="flex items-center gap-2 text-gray-700">
                  <input type="checkbox" checked={selectedLanguages.includes(lang)}
                    onChange={() => handleLanguageChange(lang)}
                    className="accent-pink-500"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-pink-700 mb-2">Genres</h2>
            <div className="space-y-2">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center gap-2 text-gray-700">
                  <input type="checkbox" checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="accent-pink-500"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Movies Grid */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold text-pink-700 mb-4">Streaming Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {homeMovies.length > 0 ? homeMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            )) : (
              <div className="col-span-full text-center text-gray-500">No movies found.</div>
            )}
          </div>

          {/* View All Button */}
          {filteredMovies.length > 8 && (
            <div className="mt-4 flex justify-center">
              <button onClick={() => navigate("/movies")}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition">
                View All Movies
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Section */}
      <TrailerSection />
    </div>
  );
};

export default Home;
