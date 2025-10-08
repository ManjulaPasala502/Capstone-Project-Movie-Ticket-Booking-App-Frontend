import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import screenImage from "../assets/screenImage.svg";
import SeatCluster from "../components/SeatCluster";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51SCYTHHWqwMvkWCfOT99XcY39jxnubjL9NLfgU6miQgVLkBDCBplQ8fHUeQs30bXR0WJFGMArYHCXszYTukJf9pk00e5OjghCd"
);

const SeatLayout = () => {
  const { showId } = useParams();

  const [show, setShow] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const rows = ["A", "B"];
  const columns = Array.from({ length: 9 }, (_, i) => i + 1);

  // Fetch show and theaters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showRes, theatersRes] = await Promise.all([
          API.get(`/shows/${showId}`),
          API.get("/theaters"),
        ]);
        const showData = showRes.data.data;
        setShow(showData);
        setTheaters(theatersRes.data.data);
        if (showData) setSelectedTheater(showData.theater._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showId]);

  // Fetch booked seats
  useEffect(() => {
    if (!showId) return setBookedSeats([]);
    API.get(`/bookings/show/${showId}`)
      .then((res) => setBookedSeats(res.data.flatMap((b) => b.seats)))
      .catch((err) => {
        console.error(err);
        setBookedSeats([]);
      });
  }, [showId]);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceed = () => {
    if (!selectedSeats.length) return alert("Please select seats!");
    setShowCheckout(true);
  };

  const handleSuccess = () => {
    setBookedSeats([...bookedSeats, ...selectedSeats]);
    setSelectedSeats([]);
    setShowCheckout(false);
    setSuccessMsg("Booking successful! Check your email for confirmation.");
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-pink-600">
        Loading seat layout...
      </p>
    );

  const totalAmount = show ? show.price * selectedSeats.length : 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Left Panel */}
      <div className="flex flex-col gap-4 w-full md:w-64 text-pink-600 cursor-pointer">
        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center md:text-left">
          Book Your Seats
        </h2>

        <div className="font-medium mb-2">Movie:</div>
        <div className="p-2 border bg-gray-100 rounded-md">
          {show ? show.movie.title : "Movie not found"}
        </div>

        <label className="font-medium mt-2">Theater:</label>
        <select
          className="p-2 border rounded-md"
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
        >
          <option value="">Select Theater</option>
          {theaters.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} - {t.location}
            </option>
          ))}
        </select>

        <label className="font-medium mt-2">Show Time:</label>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-100"
          value={
            show
              ? new Date(show.showTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""
          }
          disabled
        />
      </div>

      {/* Center Panel */}
      <div className="flex-1 flex flex-col items-center">
        <img
          src={screenImage}
          alt="Screen"
          className="w-full max-w-2xl mb-4"
        />

        <div className="flex flex-col gap-4 w-full items-center">
          <div className="flex justify-center">
            <SeatCluster
              prefix="C1"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
          </div>
          <div className="flex justify-between w-full max-w-4xl gap-4">
            <SeatCluster
              prefix="L2"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
            <SeatCluster
              prefix="R2"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
          </div>
          <div className="flex justify-between w-full max-w-4xl gap-4">
            <SeatCluster
              prefix="L3"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
            <SeatCluster
              prefix="R3"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
          </div>
          <div className="flex justify-center">
            <SeatCluster
              prefix="C4"
              rows={rows}
              columns={columns}
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              handleSeatClick={handleSeatClick}
            />
          </div>
        </div>

        <div className="mt-4 text-center font-medium text-lg">
          Selected Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}
        </div>
        {successMsg && (
          <p className="text-green-600 mt-2 font-semibold">{successMsg}</p>
        )}

        {!showCheckout && (
          <button
            onClick={handleProceed}
            disabled={checkoutLoading} // prevent multiple clicks
            className="mt-4 px-6 py-3 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-500 transition"
          >
            {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        )}

        {showCheckout && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={totalAmount}
                  seats={selectedSeats}
                  theaterId={selectedTheater}
                  showId={showId}
                  showTime={show?.showTime || ""}
                  onSuccess={handleSuccess}
                  setCheckoutLoading={setCheckoutLoading}
                />
              </Elements>
              <button
                className="mt-4 px-4 py-2 bg-gray-300 rounded-md w-full hover:bg-gray-400 transition"
                onClick={() => setShowCheckout(false)}
                disabled={checkoutLoading} // prevent closing during processing
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
