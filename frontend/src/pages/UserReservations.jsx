import { useNavigate } from "react-router-dom";

function MyReservations() {
  const navigate = useNavigate();

  return (
    <div className="page my-reservations-page">
      <div className="empty-state-card">
        <h2>My Bookings</h2>
        <p>You haven't booked any sessions yet.</p>
        <button onClick={() => navigate("/services")} className="btn btn-primary btn-lg">
          Explore Services
        </button>
      </div>
    </div>
  );
}

export default MyReservations;
