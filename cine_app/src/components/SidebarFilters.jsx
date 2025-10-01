import React, { useState } from 'react';

const languages = ['All', 'Telugu', 'Hindi', 'English', 'Tamil', 'Malayalam'];
const genres = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller'];


const Home = ({ searchValue = '' }) => {
  const [selectedLanguages, setSelectedLanguages] = useState(['All']);
  const [selectedGenres, setSelectedGenres] = useState(['All']);

  const handleLanguageChange = (lang) => {
    if (lang === 'All') {
      setSelectedLanguages(['All']);
    } else {
      setSelectedLanguages((prev) => {
        const updated = prev.includes(lang)
          ? prev.filter((l) => l !== lang)
          : [...prev.filter((l) => l !== 'All'), lang];
        return updated.length === 0 ? ['All'] : updated;
      });
    }
  };

  const handleGenreChange = (genre) => {
    if (genre === 'All') {
      setSelectedGenres(['All']);
    } else {
      setSelectedGenres((prev) => {
        const updated = prev.includes(genre)
          ? prev.filter((g) => g !== genre)
          : [...prev.filter((g) => g !== 'All'), genre];
        return updated.length === 0 ? ['All'] : updated;
      });
    }
  };

  const filteredMovies = moviesData.filter((movie) => {
    const langMatch =
      selectedLanguages.includes('All') || selectedLanguages.includes(movie.language);
    const genreMatch =
      selectedGenres.includes('All') || movie.genres.some((g) => selectedGenres.includes(g));
    const searchMatch = movie.title.toLowerCase().includes(searchValue.toLowerCase());
    return langMatch && genreMatch && searchMatch;
  });

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6">
    
      <div className="w-full md:w-1/4 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-pink-700 mb-2">Languages</h2>
          <div className="space-y-2">
            {languages.map((lang) => (
              <label key={lang} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => handleLanguageChange(lang)}
                  className="accent-pink-500"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-pink-700 mb-2">Genres</h2>
          <div className="space-y-2">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="accent-pink-500"
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

    
      <div className="w-full md:w-3/4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-60 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{movie.title}</h3>
                <p className="text-sm text-gray-600">Language: {movie.language}</p>
                <p className="text-sm text-gray-600">
                  Genre: {movie.genres.join(', ')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No movies found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
