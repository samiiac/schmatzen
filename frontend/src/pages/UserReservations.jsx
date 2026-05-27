import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserReservations } from "../services/reservationService";

function UserReservations() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: getUserReservations,
  });

  const reservations = data?.reservations || [];

  return (
    <div className="page my-reservations-page">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View and manage your reservations</p>
      </div>

      {isLoading && <div className="loading-page"><div className="spinner" /></div>}
      {error && <div className="error-page">Failed to load reservations.</div>}
      
      {!isLoading && reservations.length === 0 && (
        <div className="empty-state-card">
          <h2>My Bookings</h2>
          <p>You haven't booked any sessions yet.</p>
          <button onClick={() => navigate("/services")} className="btn btn-primary btn-lg">
            Explore Services
          </button>
        </div>
      )}

      {reservations.length > 0 && (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-header">
                <h3>{reservation.service?.name || "—"}</h3>
                <span className={`badge ${reservation.reservationStatus === "confirmed" ? "badge-success" : "badge-warning"}`}>
                  {reservation.reservationStatus}
                </span>
              </div>
              <div className="reservation-details">
                <p><strong>Package:</strong> {reservation.serviceType}</p>
                <p><strong>Date:</strong> {new Date(reservation.scheduledFor).toLocaleString()}</p>
                <p><strong>Location:</strong> {reservation.shootLocation}</p>
                <p><strong>Amount:</strong> ₹{reservation.totalAmount}</p>
              </div>
              <button 
                onClick={() => navigate(`/services/${reservation.service?._id}`)} 
                className="btn btn-outline btn-sm"
              >
                View Service
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserReservations;