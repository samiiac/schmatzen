import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createReservation } from "../services/reservationService";
import { retrieveServiceDetails } from "../services/fetchService";

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
  const [scheduledFor, setScheduledFor] = useState("");
  const [shootLocation, setShootLocation] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!service) return <div className="loading-page"><div className="spinner" /></div>;

  const price = service.pricing?.[serviceType?.toLowerCase()] || 0;
  const needsShipping = serviceType === "Premium";

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
      navigate(`/payment/${result.reservation._id}`);
    } else {
      setStatus({ type: "error", msg: result.error });
    }
  };

  return (
    <div className="page booking-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
      <h1 className="page-title">Book Your Session</h1>

      <div className="booking-layout">
        <form onSubmit={handleSubmit} className="booking-form">
          {status && <p className={`form-message ${status.type}`}>{status.msg}</p>}

          <div className="form-group">
            <label>Package</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name="serviceType" value="Basic" checked={serviceType === "Basic"} onChange={e => setServiceType(e.target.value)} />
                <span>Basic — ₹{service.pricing?.basic}</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="serviceType" value="Premium" checked={serviceType === "Premium"} onChange={e => setServiceType(e.target.value)} />
                <span>Premium — ₹{service.pricing?.premium}</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="scheduledFor">Date &amp; Time</label>
            <input type="datetime-local" id="scheduledFor" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="shootLocation">Shoot Location</label>
            <input type="text" id="shootLocation" placeholder="Venue or address" value={shootLocation} onChange={e => setShootLocation(e.target.value)} required />
          </div>

          {needsShipping && (
            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea id="shippingAddress" rows="2" placeholder="Full address for physical delivery" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes <span className="optional">(optional)</span></label>
            <textarea id="notes" rows="3" placeholder="Anything we should know?" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-full">
            {submitting ? "Processing…" : `Continue to Payment — ₹${price}`}
          </button>
        </form>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <img src={service.images?.[0] || ""} alt={service.name} className="summary-img" />
          <h4>{service.name}</h4>
          <p>Package: <strong>{serviceType}</strong></p>
          <p className="summary-total">Total: ₹{price}</p>
          <p className="summary-note">{needsShipping ? "Physical prints will be shipped." : "Digital delivery only."}</p>
        </div>
      </div>
    </div>
  );
}

export default Booking;
