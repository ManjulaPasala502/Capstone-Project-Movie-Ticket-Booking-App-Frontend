import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const AddShow = () => {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [movie, setMovie] = useState("");
  const [theater, setTheater] = useState("");
  const [showDate, setShowDate] = useState(""); // New: select date
  const [showTime, setShowTime] = useState(""); // select time dropdown
  const [price] = useState(150); // Default ticket price
  const navigate = useNavigate();

  // Example show times like SeatLayout
  const showTimes = ["10:00", "13:00", "16:00", "19:00", "22:00"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await API.get("/movies");
        setMovies(moviesRes.data.data);
        const theatersRes = await API.get("/theaters");
        setTheaters(theatersRes.data.data);
      } catch (err) {
        console.error("Failed to fetch movies or theaters:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movie || !theater || !showDate || !showTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Combine selected date + time into single Date object
      const [hours, minutes] = showTime.split(":");
      const [year, month, day] = showDate.split("-");
      const showDateTime = new Date(year, month - 1, day, hours, minutes);

      await API.post("/shows", {
        movie,
        theater,
        showTime: showDateTime,
        price,
      });

      alert("Show added successfully!");
      navigate("/owner/my-shows");

      // Reset form
      setMovie("");
      setTheater("");
      setShowDate("");
      setShowTime("");
    } catch (err) {
      console.error("Failed to add show:", err);
      alert(err.response?.data?.msg || "Error adding show");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Show</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Movie</label>
          <select
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Theater</label>
          <select
            value={theater}
            onChange={(e) => setTheater(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Theater</option>
            {theaters.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} - {t.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Show Date</label>
          <input
            type="date"
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Show Time</label>
          <select
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Time</option>
            {showTimes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Ticket Price</label>
          <input
            type="number"
            value={price}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700"
        >
          Add Show
        </button>
      </form>
    </div>
  );
};

export default AddShow;
