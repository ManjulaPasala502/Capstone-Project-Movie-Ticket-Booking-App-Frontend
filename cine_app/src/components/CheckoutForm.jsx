// File: src/components/CheckoutForm.jsx
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../services/api";

const CheckoutForm = ({ amount, seats, showId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!seats.length) {
      setErrorMsg("Please select seats");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Create booking + PaymentIntent on backend
      const { data } = await API.post(
        "/bookings/book-and-pay",
        { seats, showId, amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const { clientSecret, bookingId } = data;

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        console.log("✅ Payment succeeded, confirming booking...");

        //  Confirm booking on backend
        const confirmRes = await API.post(
          "/bookings/confirm",
          { bookingId }, // bookingId is a string now
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        console.log("Confirm API response:", confirmRes.data);

        //  Trigger frontend success
        onSuccess();
      }
    } catch (err) {
      console.error("CheckoutForm error:", err.response?.data || err.message);
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CardElement className="p-3 border rounded-md" />
      {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}
      <button
        type="submit"
        disabled={!stripe || loading || seats.length === 0}
        className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
