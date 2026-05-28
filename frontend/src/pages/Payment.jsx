import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getUserReservationById, confirmReservationPayment } from "../services/reservationService";

export default function Payment() {
  const queryClient = useQueryClient();
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch reservation on mount — handles reload case
  const { data, isLoading, error } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => getUserReservationById(reservationId),
  });

  const reservation = data?.reservation;

  const handlePay = async () => {
  setLoading(true);
  try {
    const data = await confirmReservationPayment(reservationId);
    if (data.success) {
      toast.success("Payment confirmed! Booking is now confirmed.");
      // invalidate both so MyReservations shows fresh data immediately
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
      setTimeout(() => navigate("/my-reservations"), 2000);
    } else {
      toast.error(data.message || "Payment failed. Please try again.");
    }
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0118] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-900 border-t-fuchsia-400 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-[#0c0118] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-400 text-sm">Reservation not found.</p>
          <button
            onClick={() => navigate("/my-reservations")}
            className="text-purple-400 hover:text-fuchsia-400 text-sm transition-colors"
          >
            ← Back to bookings
          </button>
        </div>
      </div>
    );
  }

  // ── Already paid guard (reload safety) ──────────────────────────────────
  if (reservation.paymentStatus === "paid") {
    return (
      <div className="min-h-screen bg-[#0c0118] flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto text-white text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-bold text-purple-50">Already Paid</h2>
          <p className="text-purple-400 text-sm">
            This reservation has already been confirmed and paid.
          </p>
          <button
            onClick={() => navigate("/my-reservations")}
            className="w-full py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  // ── Payment page ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0c0118] px-4 py-12">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-purple-400 hover:text-fuchsia-400 text-sm transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-purple-50">Complete Payment</h1>

        {/* Reservation summary */}
        <div className="bg-[#1a0a2e] border border-fuchsia-900/40 rounded-2xl p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-purple-500 font-semibold">
            Booking Summary
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-400">Service</span>
              <span className="text-purple-100 font-medium">{reservation.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Package</span>
              <span className="text-purple-100">{reservation.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Date</span>
              <span className="text-purple-100">
                {new Date(reservation.scheduledFor).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Location</span>
              <span className="text-purple-100">{reservation.shootLocation}</span>
            </div>
            <div className="border-t border-purple-900/40 pt-2 mt-2 flex justify-between">
              <span className="text-purple-300 font-semibold">Total</span>
              <span className="text-fuchsia-400 font-bold text-base">
                NPR {reservation.totalAmount}
              </span>
            </div>
          </div>
          <p className="font-mono text-purple-700 text-xs break-all pt-1">
            ID: {reservationId}
          </p>
        </div>

        {/* Payment method */}
        <div className="bg-[#1a0a2e] border border-purple-900/30 rounded-2xl p-6 space-y-5">
          <h3 className="text-purple-100 font-semibold">Payment Method</h3>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/20">
            <div className="text-xl font-bold tracking-tight leading-none select-none">
              <span className="text-blue-400">Pay</span>
              <span className="text-blue-300">Pal</span>
            </div>
            <div className="flex-1">
              <p className="text-purple-100 text-sm font-medium">PayPal</p>
              <p className="text-purple-500 text-xs">Fast and secure</p>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-fuchsia-400 bg-fuchsia-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

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
              `Pay NPR ${reservation.totalAmount}`
            )}
          </button>

          <p className="text-center text-xs text-purple-700">
            🔒 Dummy payment — for demo purposes only.
          </p>
        </div>

      </div>
    </div>
  );
}