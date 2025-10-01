import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ManageTheatersOwner = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await API.get("/theaters"); // owner only sees their theaters
        setTheaters(res.data.data);
      } catch (err) {
        console.error("Failed to fetch theaters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading theaters...</p>;

  return (
    <div className="px-4 md:px-16 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">My Theaters</h1>
      {theaters.length === 0 ? (
        <p className="text-center text-gray-500">No theaters registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {theaters.map((theater) => (
            <div key={theater._id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold">{theater.name}</h2>
              <p><strong>Location:</strong> {theater.location}</p>
              <p><strong>Total Seats:</strong> {theater.totalSeats}</p>
              <p><strong>Approved:</strong> {theater.approved ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTheatersOwner;
