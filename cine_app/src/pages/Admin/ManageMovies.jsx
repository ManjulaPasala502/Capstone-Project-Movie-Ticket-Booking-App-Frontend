import React, { useEffect, useState } from "react";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../../services/api";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genres: "",
    language: "",
    duration: "",
    releaseDate: "",
    trailer: "",
    rating: "",
    poster: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch movies from backend
  const fetchMovies = async () => {
    try {
      const { data } = await getMovies();
      setMovies(data.data);
    } catch (err) {
      console.error("Fetch movies error:", err);
      alert("❌ Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setForm({ ...form, poster: e.target.files[0] });
  };

  // Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("genres", JSON.stringify(form.genres.split(",")));
      formData.append("language", form.language);
      formData.append("duration", form.duration);
      formData.append("releaseDate", form.releaseDate);
      formData.append("trailer", form.trailer);
      formData.append("rating", form.rating);
      if (form.poster) formData.append("poster", form.poster);

      if (editingId) {
        await updateMovie(editingId, formData);
        alert("🎬 Movie updated successfully!");
      } else {
        await addMovie(formData);
        alert("✅ Movie added successfully!");
      }

      fetchMovies();
      setForm({
        title: "",
        genres: "",
        language: "",
        duration: "",
        releaseDate: "",
        trailer: "",
        rating: "",
        poster: null,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Add/Edit movie error:", err);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Edit movie
  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      genres: movie.genres.join(","),
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate?.split("T")[0] || "",
      trailer: movie.trailer,
      rating: movie.rating,
      poster: null,
    });
    setEditingId(movie._id);
  };

  // Delete movie
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(id);
        alert("🗑️ Movie deleted successfully!");
        fetchMovies();
      } catch (err) {
        console.error("Delete movie error:", err);
        alert("❌ Failed to delete movie");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 p-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🎬 Manage Movies</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-8 border-t-4 border-pink-400 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="title"
          placeholder="Title"
          className="border border-pink-400 rounded-lg p-2"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="genres"
          placeholder="Genres (comma separated)"
          className="border border-pink-400 rounded-lg p-2"
          value={form.genres}
          onChange={handleChange}
        />
        <input
          name="language"
          placeholder="Language"
          className="border border-pink-400 rounded-lg p-2"
          value={form.language}
          onChange={handleChange}
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 2h 10m)"
          className="border border-pink-400 rounded-lg p-2"
          value={form.duration}
          onChange={handleChange}
        />
        <input
          type="date"
          name="releaseDate"
          className="border border-pink-400 rounded-lg p-2"
          value={form.releaseDate}
          onChange={handleChange}
        />
        <input
          name="trailer"
          placeholder="Trailer YouTube URL"
          className="border border-pink-400 rounded-lg p-2"
          value={form.trailer}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-10)"
          step="0.1"
          min="0"
          max="10"
          className="border border-pink-400 rounded-lg p-2"
          value={form.rating}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-pink-400 rounded-lg p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 text-white rounded-lg py-2 font-semibold hover:bg-pink-600 md:col-span-2"
        >
          {editingId ? "Update Movie" : "Add Movie"}
        </button>
      </form>

      {/* Movie List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white p-4 rounded-2xl shadow border-t-4 border-cyan-400"
          >
            {movie.poster && (
              <img
                src={
                  movie.poster.startsWith("http")
                    ? movie.poster
                    : `http://localhost:3000/${movie.poster}`
                }
                alt={movie.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-pink-600">{movie.title}</h2>
            <p className="text-gray-600">
              {movie.language} • {movie.duration}
            </p>
            <p className="text-gray-600">Genres: {movie.genres?.join(", ")}</p>
            <p className="text-gray-600">Rating: ⭐ {movie.rating}</p>
            <p className="text-gray-600">
              Release: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(movie)}
                className="bg-cyan-500 text-white px-4 py-1 rounded-lg hover:bg-cyan-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(movie._id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMovies;
