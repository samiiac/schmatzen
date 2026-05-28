import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createReservation } from "../services/reservationService";
import { retrieveServiceDetails } from "../services/fetchService";
import toast from "react-hot-toast";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 20 && minute === 30) continue;
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};
const TIME_SLOTS = generateTimeSlots();
const DEFAULT_TIME = "10:00";

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => retrieveServiceDetails(serviceId),
    enabled: !!serviceId,
  });
  const service = data?.service;

  const [serviceType, setServiceType] = useState("Basic");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);
  const [scheduledFor, setScheduledFor] = useState("");
  const [shootLocation, setShootLocation] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Track previous service ID to avoid unnecessary resets
  const prevServiceIdRef = useRef();

  // Reset package when service changes (new service loaded)
  useEffect(() => {
    if (service && service._id !== prevServiceIdRef.current) {
      prevServiceIdRef.current = service._id;
      setServiceType("Basic");
    }
  }, [service]);

  // Keep scheduledFor in sync with date+time
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setScheduledFor(`${selectedDate}T${selectedTime}`);
    } else {
      setScheduledFor("");
    }
  }, [selectedDate, selectedTime]);

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[45vh]">
        <div className="w-10 h-10 border-4 border-[rgba(232,121,249,0.15)] border-t-[#e879f9] rounded-full animate-spin" />
      </div>
    );
  }

  const price = service.pricing?.[serviceType?.toLowerCase()] || 0;
  const needsShipping = serviceType === "Premium";
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceType || !scheduledFor || !shootLocation) {
      setStatus({ type: "error", msg: "Please fill in all required fields." });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const result = await createReservation({
      service: serviceId,
      serviceType,
      scheduledFor,
      shootLocation,
      ...(needsShipping && { shippingAddress }),
      notes,
    });

    setSubmitting(false);

    if (result.reservation) {
      toast.success("Reservation confirmed");

      // small delay so user sees confirmation
      setTimeout(() => {
        navigate(`/payment/${result.reservation._id}`);
      }, 600);

      return;
    }

    toast.error(result.error);
    setStatus({ type: "error", msg: result.error });
  };

  return (
    <div className="page booking-page max-w-[1140px] mx-auto px-6 py-8 font-sans">
   
     

      <h1 className="page-title font-['Playfair_Display',serif] text-4xl text-[#f3e8ff] mb-2">
        Book Your Session
      </h1>

      <div className="booking-layout grid md:grid-cols-[1.4fr_1fr] gap-8 mt-2">
        <form
          onSubmit={handleSubmit}
          className="booking-form bg-[#1a0a2e] border border-[rgba(167,139,250,0.15)] rounded-2xl p-8"
        >
          {status && (
            <div
              className={`form-message p-3 rounded-xl mb-4 text-sm ${
                status.type === "error"
                  ? "bg-[rgba(248,113,113,0.1)] text-[#f87171] border border-[rgba(248,113,113,0.25)]"
                  : "bg-[rgba(74,222,128,0.1)] text-[#4ade80] border border-[rgba(74,222,128,0.25)]"
              }`}
            >
              {status.msg}
            </div>
          )}

          {/* Package selection */}
          <div className="form-group mb-5">
            <label className="block text-[#a78bfa] text-sm font-medium mb-1">
              Choose Package
            </label>
            <div className="radio-grid grid sm:grid-cols-2 gap-4">
              <label
                className={`relative flex p-4 border rounded-xl cursor-pointer transition-all ${
                  serviceType === "Basic"
                    ? "border-[#e879f9] bg-[rgba(232,121,249,0.08)]"
                    : "border-[rgba(167,139,250,0.15)] hover:border-[#e879f9]"
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  value="Basic"
                  checked={serviceType === "Basic"}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#f3e8ff]">Basic</h4>
                  <p className="text-lg font-bold text-[#e879f9] mt-1">
                    NPR {service.pricing?.basic}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-[#231040] text-[#a78bfa] px-2 py-1 rounded-full">
                    Digital Delivery
                  </span>
                </div>
              </label>

              <label
                className={`relative flex p-4 border rounded-xl cursor-pointer transition-all ${
                  serviceType === "Premium"
                    ? "border-[#e879f9] bg-[rgba(232,121,249,0.08)]"
                    : "border-[rgba(167,139,250,0.15)] hover:border-[#e879f9]"
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  value="Premium"
                  checked={serviceType === "Premium"}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#f3e8ff]">Premium</h4>
                  <p className="text-lg font-bold text-[#e879f9] mt-1">
                    NPR {service.pricing?.premium}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-[#231040] text-[#a78bfa] px-2 py-1 rounded-full">
                    Includes Prints + Shipping
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-group mb-5">
            <label className="block text-[#a78bfa] text-sm font-medium mb-1">
              Session Date & Time
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all"
              />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Shoot Location */}
          <div className="form-group mb-5">
            <label
              htmlFor="shootLocation"
              className="block text-[#a78bfa] text-sm font-medium mb-1"
            >
              Shoot Location
            </label>
            <input
              type="text"
              id="shootLocation"
              placeholder="Venue or address"
              value={shootLocation}
              onChange={(e) => setShootLocation(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all"
            />
          </div>

          {needsShipping && (
            <div className="form-group mb-5">
              <label
                htmlFor="shippingAddress"
                className="block text-[#a78bfa] text-sm font-medium mb-1"
              >
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                rows={2}
                placeholder="Full address for physical delivery"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all"
              />
            </div>
          )}

          <div className="form-group mb-5">
            <label
              htmlFor="notes"
              className="block text-[#a78bfa] text-sm font-medium mb-1"
            >
              Notes{" "}
              <span className="text-[#a78bfa]/60 text-xs">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Anything we should know?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 px-6 rounded-full font-semibold text-white bg-gradient-to-r from-[#e879f9] to-[#f472b6] shadow-[0_0_30px_rgba(232,121,249,0.2)] hover:shadow-[0_0_60px_rgba(232,121,249,0.3)] hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing…" : `Continue to Payment — NPR ${price}`}
          </button>
        </form>

        <div className="booking-summary sticky top-[90px] bg-[#1a0a2e] border border-[rgba(167,139,250,0.15)] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[#f3e8ff] mb-4 font-['Playfair_Display',serif]">
            Booking Summary
          </h3>
          <img
            src={service.images?.[0] || ""}
            alt={service.name}
            className="w-full h-[190px] object-cover rounded-xl bg-[#231040] mb-4"
          />
          <h4 className="text-xl font-semibold text-[#f3e8ff]">
            {service.name}
          </h4>
          <p className="text-[#a78bfa] mt-2">
            Package: <strong className="text-[#f3e8ff]">{serviceType}</strong>
          </p>
          {selectedDate && (
            <p className="text-[#a78bfa]">
              Date:{" "}
              <strong className="text-[#f3e8ff]">
                {new Date(selectedDate).toLocaleDateString()}
              </strong>
            </p>
          )}
          {selectedTime && (
            <p className="text-[#a78bfa]">
              Time: <strong className="text-[#f3e8ff]">{selectedTime}</strong>
            </p>
          )}
          <div className="border-t border-[rgba(167,139,250,0.15)] my-4 pt-3">
            <p className="summary-total text-2xl font-bold bg-gradient-to-r from-[#e879f9] to-[#f472b6] bg-clip-text text-transparent">
              Total: NPR {price}
            </p>
            <p className="summary-note text-sm text-[#a78bfa] mt-2">
              {needsShipping
                ? "Physical prints will be shipped."
                : "Digital delivery only."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
