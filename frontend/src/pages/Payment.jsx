import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confirmReservationPayment } from "../services/reservationService";

export default function Payment() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePay = async () => {
  setLoading(true);
  try {
    const data = await confirmReservationPayment(reservationId);

    if (data.success) {
      showToast("success", "Payment confirmed! Your booking is now confirmed.");
      setTimeout(() => navigate("/my-reservations"), 2000);
    } else {
      showToast("error", data.message || "Payment failed. Please try again.");
    }
  } catch {
    showToast("error", "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0c0118] px-4 py-12">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium transition-all
            ${toast.type === "success"
              ? "bg-emerald-950 border border-emerald-700/50 text-emerald-300"
              : "bg-red-950 border border-red-700/50 text-red-300"
            }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-purple-400 hover:text-fuchsia-400 text-sm mb-6 transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-purple-50 mb-8">Complete Payment</h1>

        <div className="space-y-4">

          {/* Reservation ID */}
          <div className="bg-[#1a0a2e] border border-fuchsia-900/40 rounded-2xl p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-purple-500 font-semibold mb-1">
              Reservation ID
            </p>
            <p className="font-mono text-purple-300 text-sm break-all">{reservationId}</p>
          </div>

          {/* Payment method */}
          <div className="bg-[#1a0a2e] border border-purple-900/30 rounded-2xl p-6 space-y-6">
            <h3 className="text-purple-100 font-semibold">Payment Method</h3>

            {/* PayPal — only option, always selected */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/20">
              <div className="text-xl font-bold tracking-tight leading-none select-none">
                <span className="text-blue-400">Pay</span>
                <span className="text-blue-300">Pal</span>
              </div>
              <div className="flex-1">
                <p className="text-purple-100 text-sm font-medium">PayPal</p>
                <p className="text-purple-500 text-xs">Fast and secure</p>
              </div>
              {/* Always-selected indicator */}
              <div className="w-4 h-4 rounded-full border-2 border-fuchsia-400 bg-fuchsia-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-fuchsia-900/40 hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                "Pay with PayPal"
              )}
            </button>

            <p className="text-center text-xs text-purple-700">
              🔒 Dummy payment — for demo purposes only.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}