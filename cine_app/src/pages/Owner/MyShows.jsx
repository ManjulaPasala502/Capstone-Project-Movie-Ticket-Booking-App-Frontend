import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getMyShows, deleteShow } from "../../services/show";
import { AuthContext } from "../../context/AuthContext";

const MyShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Ensure user context exists
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      if (!user || user.role !== "owner") {
        setError("You must be logged in as an owner to view this page.");
        setLoading(false);
        return;
      }

      try {
        const res = await getMyShows(); // Axios interceptor adds token
        setShows(res.data || []);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
        setError(
          err.response?.data?.msg ||
          "Failed to load your shows. Make sure you are logged in as an owner."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading your shows...</p>;

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (shows.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">
        No shows available.{" "}
        <button
          onClick={() => navigate("/owner/add-show")}
          className="ml-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Add a Show
        </button>
      </div>
    );

  return (
    <div className="px-4 md:px-16 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">My Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shows.map((show) => (
          <div key={show._id} className="p-4 bg-white rounded shadow">
            <h2 className="font-bold">{show.movie?.title || "Unknown Movie"}</h2>
            <p>
              <strong>Theater:</strong> {show.theater?.name || "Unknown Theater"}
            </p>
            <p>
              <strong>Time:</strong> {new Date(show.showTime).toLocaleString()}
            </p>
            <p>
              <strong>Price:</strong> ₹{show.price}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => navigate(`/owner/add-show?edit=${show._id}`)}
                className="px-2 py-1 bg-pink-500 text-white rounded hover:bg-cyan-500 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this show?")) {
                    try {
                      await deleteShow(show._id);
                      setShows(shows.filter((s) => s._id !== show._id));
                    } catch (err) {
                      alert("Failed to delete show.");
                    }
                  }
                }}
                className="px-2 py-1 bg-cyan-500 text-white rounded hover:bg-pink-500 cursor-pointer"
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

export default MyShows;
