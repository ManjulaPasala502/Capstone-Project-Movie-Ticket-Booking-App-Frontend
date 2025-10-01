// SeatCluster.jsx
import React from "react";

const SeatCluster = ({ prefix, rows, columns, selectedSeats, bookedSeats, handleSeatClick }) => {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row} className="flex gap-2 justify-center">
          {columns.map((col) => {
            const seatId = `${prefix}-${row}${col}`;
            const isSelected = selectedSeats.includes(seatId);
            const isBooked = bookedSeats.includes(seatId);

            return (
              <button
                key={seatId}
                onClick={() => !isBooked && handleSeatClick(seatId)}
                disabled={isBooked}
                className={`
                  w-8 h-8 rounded-md text-xs font-semibold
                  ${isBooked ? "bg-gray-400 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-pink-600 text-white" : "bg-cyan-200"}
                  hover:!bg-pink-500 transition
                `}
              >
                {row}{col}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SeatCluster;
