import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Manage Movies", path: "/admin/movies", color: "from-pink-400 to-cyan-400", icon: "🎬" },
    { title: "Manage Theaters", path: "/admin/theaters", color: "from-cyan-400 to-pink-400", icon: "🏛️" },
    { title: "Manage Bookings", path: "/admin/bookings", color: "from-pink-400 to-cyan-400", icon: "🎟️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 p-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🎬 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer bg-gradient-to-r ${card.color} text-white shadow-lg rounded-2xl p-6 hover:scale-105 transition`}
          >
            <div className="text-4xl">{card.icon}</div>
            <h2 className="text-xl font-semibold mt-2">{card.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
