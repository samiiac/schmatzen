import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateReservation } from "../services/reservationService";

function Payment() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");
  const [step, setStep] = useState("review");
  const [err, setErr] = useState(null);

  const handlePay = () => {
    setStep("processing");
    setTimeout(async () => {
      const { reservation } = await updateReservation(reservationId, {
        reservationStatus: "confirmed",
        paymentStatus: "paid",
      });
      if (reservation) setStep("success");
      else { setErr("Payment failed. Try again."); setStep("review"); }
    }, 2500);
  };

  if (step === "processing") {
    return (
      <div className="page payment-page">
        <div className="processing">
          <div className="spinner" />
          <h2>Processing Payment…</h2>
          <p>Please do not close this page.</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="page payment-page">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. You will receive a confirmation shortly.</p>
          <button onClick={() => navigate("/my-reservations")} className="btn btn-primary btn-lg">View My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page payment-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
      <h1 className="page-title">Complete Payment</h1>

      <div className="payment-layout">
        <div className="payment-card">
          <h3>Payment Method</h3>

          {["card", "upi", "cod"].map(m => (
            <label key={m} className={`method-card ${method === m ? "active" : ""}`}>
              <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} />
              <span className="method-label">
                {m === "card" ? "Credit / Debit Card" : m === "upi" ? "UPI" : "Cash on Delivery"}
              </span>
            </label>
          ))}

          {method === "card" && (
            <div className="card-fields">
              <div className="form-group"><label>Card Number</label><input placeholder="1234 5678 9012 3456" /></div>
              <div className="form-group"><label>Cardholder Name</label><input placeholder="Name on card" /></div>
              <div className="form-row">
                <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" /></div>
                <div className="form-group"><label>CVV</label><input placeholder="123" /></div>
              </div>
            </div>
          )}

          {method === "upi" && <p className="method-info">Enter your UPI ID on the next screen to complete payment.</p>}
          {method === "cod" && <p className="method-info">Pay in cash when the photographer arrives at your location.</p>}

          {err && <p className="form-message error">{err}</p>}

          <button onClick={handlePay} className="btn btn-primary btn-lg btn-full">Pay Now</button>
          <p className="secure-note">🔒 Dummy payment page — for demo purposes only.</p>
        </div>

        <div className="payment-summary-card">
          <h3>Reservation ID</h3>
          <p className="reservation-id">{reservationId}</p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
