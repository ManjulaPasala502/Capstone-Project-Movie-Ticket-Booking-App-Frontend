import React from "react";

const TheaterPicker = ({ theaters, onSelect }) => {
  if (!Array.isArray(theaters) || theaters.length === 0) {
    return <p>No theaters available.</p>;
  }

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="p-2 border rounded w-full"
    >
      <option value="">Select Theater</option>
      {theaters.map((theater) => (
        <option key={theater._id} value={theater._id}>
          {theater.name} - {theater.location}
        </option>
      ))}
    </select>
  );
};

export default TheaterPicker;
