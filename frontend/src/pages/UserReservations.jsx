import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getUserReservations,
  updateUserReservation,
  deleteReservation,
} from "../services/reservationService";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a0a2e] border border-purple-900/40 w-full max-w-md p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-purple-100 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-purple-500 hover:text-purple-200 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const statusStyles = {
  confirmed: "bg-blue-950/60 text-blue-300 border border-blue-700/30",
  completed: "bg-emerald-950/60 text-emerald-300 border border-emerald-700/30",
  pending:   "bg-yellow-950/60 text-yellow-300 border border-yellow-700/30",
  cancelled: "bg-red-950/60 text-red-300 border border-red-700/30",
};

const paymentStyles = {
  paid:     "bg-emerald-950/60 text-emerald-400 border border-emerald-700/30",
  pending:  "bg-yellow-950/60 text-yellow-400 border border-yellow-700/30",
  refunded: "bg-purple-950/60 text-purple-400 border border-purple-700/30",
};

const inputCls = "w-full bg-[#0c0118] border border-purple-900/50 text-purple-100 placeholder-purple-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fuchsia-700/60";

export default function UserReservations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: getUserReservations,
  });

  const reservations = data?.reservations || [];

  const [cancelTarget, setCancelTarget]   = useState(null);
  const [upgradeTarget, setUpgradeTarget] = useState(null);
  const [cancelling, setCancelling]       = useState(false);
  const [upgrading, setUpgrading]         = useState(false);

  const [shipping, setShipping] = useState({ street: "", city: "", country: "" });
  const setField = (field) => (e) => setShipping((p) => ({ ...p, [field]: e.target.value }));

  // ← fixed: confirmed bookings can also be edited/cancelled
  const canEdit      = (r) => r.reservationStatus === "pending" || r.reservationStatus === "confirmed";
  const needsPayment = (r) => r.paymentStatus !== "paid";
  const isDigital    = (r) => r.deliveryType === "Digital";

  const handleCancel = async () => {
    setCancelling(true);
    const res = await deleteReservation(cancelTarget._id);
    setCancelling(false);
    if (res.success) {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
    } else {
      toast.error(res.message || "Failed to cancel");
    }
    setCancelTarget(null);
  };

  const handleUpgrade = async () => {
    const { street, city, country } = shipping;
    if (!street.trim() || !city.trim() || !country.trim()) {
      toast.error("All shipping address fields are required");
      return;
    }
    setUpgrading(true);
    const res = await updateUserReservation(upgradeTarget._id, {
      serviceType: "Premium",
      deliveryType: "Digital and Physical",
      shippingAddress: { street, city, country },
    });
    setUpgrading(false);
    if (res.updatedReservation) {
      toast.success("Upgraded to Premium — physical prints included");
      queryClient.invalidateQueries({ queryKey: ["user-reservations"] });
      setUpgradeTarget(null);
      setShipping({ street: "", city: "", country: "" });
    } else {
      toast.error(res.message || "Upgrade failed");
    }
  };

  const openUpgrade = (r) => {
    setUpgradeTarget(r);
    setShipping({
      street:  r.shippingAddress?.street  || "",
      city:    r.shippingAddress?.city    || "",
      country: r.shippingAddress?.country || "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0118] px-4 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-50">My Bookings</h1>
          <p className="text-purple-400 text-base mt-2">Manage your photography reservations</p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-900 border-t-fuchsia-400 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 text-base py-10">Failed to load reservations.</p>
        )}

        {!isLoading && !error && reservations.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <p className="text-purple-400 text-base">No bookings yet.</p>
            <button
              onClick={() => navigate("/services")}
              className="text-fuchsia-400 hover:text-fuchsia-300 text-base transition-colors"
            >
              Browse services →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="bg-[#1a0a2e] border border-purple-900/30 rounded-2xl p-5 flex flex-col gap-4 hover:border-fuchsia-900/50 transition-colors"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-purple-100 text-base leading-snug">
                  {r.service?.name ?? "—"}
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${statusStyles[r.reservationStatus] ?? statusStyles.pending}`}>
                  {r.reservationStatus}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-purple-400">
                <p><span className="text-purple-500">Package</span> · {r.serviceType}</p>
                <p><span className="text-purple-500">Date</span> · {new Date(r.scheduledFor).toLocaleString()}</p>
                <p><span className="text-purple-500">Location</span> · {r.shootLocation}</p>
                <p><span className="text-purple-500">Delivery</span> · {r.deliveryType}</p>
                {r.shippingAddress?.street && (
                  <p>
                    <span className="text-purple-500">Ship to</span> · {r.shippingAddress.street}, {r.shippingAddress.city}, {r.shippingAddress.country}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                  <span className="text-purple-200 font-semibold text-base">NPR {r.totalAmount}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${paymentStyles[r.paymentStatus] ?? paymentStyles.pending}`}>
                    {r.paymentStatus || "pending"}
                  </span>
                </div>
              </div>

              {/* Pay Now */}
              {needsPayment(r) && r.reservationStatus !== "cancelled" && (
                <button
                  onClick={() => navigate(`/payment/${r._id}`)}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-fuchsia-900/30 hover:brightness-110 hover:-translate-y-0.5 transition-all"
                >
                  Pay Now · NPR {r.totalAmount}
                </button>
              )}

              {/* Actions */}
              {canEdit(r) && (
                <div className="flex gap-2 mt-auto">
                  {/* {isDigital(r) && (
                    <button
                      onClick={() => openUpgrade(r)}
                      className="flex-1 text-sm py-2 border border-purple-800/50 text-purple-400 rounded-full hover:border-fuchsia-700/50 hover:text-fuchsia-400 transition-colors"
                    >
                      → Physical
                    </button>
                  )} */}
                  <button
                    onClick={() => setCancelTarget(r)}
                    className="flex-1 text-sm py-2 border border-red-900/40 text-red-400 rounded-full hover:border-red-700/50 hover:text-red-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Cancel Modal ── */}
      <Modal
        open={!!cancelTarget}
        title="Cancel Booking"
        onClose={() => !cancelling && setCancelTarget(null)}
      >
        <p className="text-purple-400 text-sm mb-2">
          Are you sure you want to cancel{" "}
          <span className="text-purple-200 font-medium">{cancelTarget?.service?.name}</span>?
        </p>
        <p className="text-purple-600 text-xs mb-6">This cannot be undone.</p>
        <div className="flex gap-3">
          <button
            disabled={cancelling}
            onClick={() => setCancelTarget(null)}
            className="flex-1 py-2.5 border border-purple-800/50 text-purple-400 rounded-full text-sm hover:border-purple-600 transition-colors disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            disabled={cancelling}
            onClick={handleCancel}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cancelling
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Cancelling…</>
              : "Yes, Cancel"
            }
          </button>
        </div>
      </Modal>

      {/* ── Upgrade Modal ── */}
      <Modal
        open={!!upgradeTarget}
        title="Upgrade to Physical Delivery"
        onClose={() => !upgrading && setUpgradeTarget(null)}
      >
        <p className="text-purple-400 text-sm mb-1">
          Upgrading to <span className="text-purple-200 font-medium">Premium</span> adds physical prints shipped to your door.
        </p>
        <p className="text-fuchsia-400 text-sm font-medium mb-5">
          New total: NPR {upgradeTarget?.service?.pricing?.premium ?? "—"}
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs text-purple-500 uppercase tracking-wider mb-1.5">Street</label>
            <input
              className={inputCls}
              placeholder="123 Main Street"
              value={shipping.street}
              onChange={setField("street")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-purple-500 uppercase tracking-wider mb-1.5">City</label>
              <input
                className={inputCls}
                placeholder="Kathmandu"
                value={shipping.city}
                onChange={setField("city")}
              />
            </div>
            <div>
              <label className="block text-xs text-purple-500 uppercase tracking-wider mb-1.5">Country</label>
              <input
                className={inputCls}
                placeholder="Nepal"
                value={shipping.country}
                onChange={setField("country")}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            disabled={upgrading}
            onClick={() => setUpgradeTarget(null)}
            className="flex-1 py-2.5 border border-purple-800/50 text-purple-400 rounded-full text-sm hover:border-purple-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={upgrading}
            onClick={handleUpgrade}
            className="flex-1 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-full text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {upgrading
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Upgrading…</>
              : "Confirm Upgrade"
            }
          </button>
        </div>
      </Modal>
    </div>
  );
}