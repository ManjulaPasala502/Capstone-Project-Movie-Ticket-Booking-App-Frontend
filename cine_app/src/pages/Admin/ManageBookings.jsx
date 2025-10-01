import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data.data || []); // Ensure it's always an array
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 p-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🎟️ Manage Bookings</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-pink-400 to-cyan-400 text-white">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Movie</th>
              <th className="p-3">Theater</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-pink-50">
                  <td className="p-3">{b.user?.name || "N/A"}</td>
                  <td className="p-3">{b.show?.movie?.title || "N/A"}</td>
                  <td className="p-3">{b.theater?.name || "N/A"}</td>
                  <td className="p-3">{b.seats?.join(", ") || "N/A"}</td>
                  <td className="p-3">₹{b.totalPrice ?? "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
