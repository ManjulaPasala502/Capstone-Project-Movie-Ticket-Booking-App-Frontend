import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch theaters owned by logged-in owner
        const theatersRes = await API.get("/theaters");
        const theatersData = theatersRes?.data?.data || [];
        setTheaters(theatersData);

        // Fetch shows
        const showsRes = await API.get("/shows");
        const showsData = showsRes?.data?.data || [];

        // Filter shows that belong to owner's theaters
        const ownerShows = showsData.filter(show =>
          theatersData.some(t => t._id === show.theater?._id)
        );
        setShows(ownerShows);

        // Fetch bookings for owner's shows
        const bookingsRes = await API.get("/bookings/owner");
        const bookingsData = bookingsRes?.data?.data || [];
        setBookings(bookingsData);

      } catch (err) {
        console.error("Failed to fetch owner dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading dashboard...</p>;

  return (
    <div className="px-4 md:px-16 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Owner Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded shadow text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Total Theaters</h2>
          <p className="text-3xl font-bold mt-2">{theaters.length}</p>
        </div>

        <div className="p-6 bg-white rounded shadow text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Total Shows</h2>
          <p className="text-3xl font-bold mt-2">{shows.length}</p>
        </div>

        <div className="p-6 bg-white rounded shadow text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-3xl font-bold mt-2">{bookings.length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/owner/my-shows")}
          className="p-4 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 transition"
        >
          Manage Shows
        </button>
        <button
          onClick={() => navigate("/owner/manage-theaters")}
          className="p-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
        >
          Manage Theaters
        </button>
        <button
          onClick={() => navigate("/owner/add-show")}
          className="p-4 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition"
        >
          Add New Show
        </button>
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Movie</th>
                  <th className="py-2 px-4">Theater</th>
                  <th className="py-2 px-4">Seats</th>
                  <th className="py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(-5).reverse().map(b => (
                  <tr key={b._id} className="text-center border-t">
                    <td className="py-2 px-4">{b.user?.name || "N/A"}</td>
                    <td className="py-2 px-4">{b.show?.movie?.title || "N/A"}</td>
                    <td className="py-2 px-4">{b.show?.theater?.name || "N/A"}</td>
                    <td className="py-2 px-4">{b.seats?.join(", ") || "N/A"}</td>
                    <td className="py-2 px-4">₹{b.totalPrice || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
