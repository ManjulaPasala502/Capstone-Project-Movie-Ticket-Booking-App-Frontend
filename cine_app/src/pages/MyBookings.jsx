import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/users/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (bookings.length === 0)
    return (
      <div className="text-center mt-10 text-pink-500">
        No bookings found
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-pink-500">My Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-4 bg-white shadow-lg rounded-xl border border-gray-200"
          >
            <h2 className="text-lg font-semibold mb-2">
              {booking.show?.movie?.title || "Movie"}
            </h2>
            <p>
              <strong>Theater:</strong> {booking.theater?.name} (
              {booking.theater?.location})
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.show?.showTime).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(booking.show?.showTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p>
              <strong>Seats:</strong> {booking.seats.join(", ")}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{booking.totalPrice}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Booking ID: {booking._id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
