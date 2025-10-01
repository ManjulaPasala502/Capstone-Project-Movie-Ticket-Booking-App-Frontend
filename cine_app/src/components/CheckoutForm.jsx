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
      // 1️⃣ Create booking + payment intent on backend
      const { data } = await API.post("/bookings/book-and-pay", {
        seats,
        showId,
        amount,
      });

      const { clientSecret, bookingId } = data;

      // 2️⃣ Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMsg(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3️⃣ Confirm booking after successful payment
        await API.post("/bookings/confirm", { bookingId });
        onSuccess();
      }
    } catch (err) {
      console.error(err);
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
        disabled={!stripe || loading}
        className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
