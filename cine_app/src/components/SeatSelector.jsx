// SeatSelector.jsx
import { useState } from "react";
import "./SeatSelector.css";

const SeatSelector = ({ totalSeats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Generate seat rows (A, B, C...) dynamically
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const seatsPerRow = 10; // Customize seats per row
  const totalRows = Math.ceil(totalSeats / seatsPerRow);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const renderSeats = () => {
    const seatElements = [];
    for (let row = 0; row < totalRows; row++) {
      const rowLetter = rows[row];
      const rowSeats = [];

      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatIndex = row * seatsPerRow + seatNum;
        if (seatIndex > totalSeats) break;
        const seatId = `${rowLetter}${seatNum}`;
        rowSeats.push(
          <div
            key={seatId}
            className={`seat ${selectedSeats.includes(seatId) ? "selected" : ""}`}
            onClick={() => handleSeatClick(seatId)}
          >
            {seatNum}
          </div>
        );
      }

      seatElements.push(
        <div key={rowLetter} className="seat-row">
          <div className="row-label">{rowLetter}</div>
          {rowSeats}
        </div>
      );
    }
    return seatElements;
  };

  return (
    <div className="seat-selector-container">
      {renderSeats()}
      <div className="selected-info">
        Selected Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}
      </div>
    </div>
  );
};

export default SeatSelector;
