import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ManageTheaters = () => {
  const [theaters, setTheaters] = useState([]);

  const fetchTheaters = async () => {
    const res = await API.get("/theaters");
    setTheaters(res.data.data);
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 p-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🏛️ Manage Theaters</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded-2xl shadow border-t-4 border-pink-400">
            <h2 className="text-xl font-bold text-cyan-600">{t.name}</h2>
            <p className="text-gray-600">{t.location}</p>
            <p className="text-gray-500 mt-2 text-sm">Owner: {t.owner?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheaters;
