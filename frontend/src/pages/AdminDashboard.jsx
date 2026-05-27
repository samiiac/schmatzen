import { Link } from "react-router-dom";
import { FiPackage, FiCalendar, FiUsers } from "react-icons/fi";

function AdminDashboard() {
  return (
    <div className="page admin-dashboard-page">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="admin-grid">
        <Link to="/admin/services" className="admin-card">
          <FiPackage size={40} />
          <h3>Manage Services</h3>
          <p>Add, edit, or remove photography services</p>
        </Link>

        <Link to="/admin/reservations" className="admin-card">
          <FiCalendar size={40} />
          <h3>View Reservations</h3>
          <p>See all customer bookings and update status</p>
        </Link>

        <Link to="/services" className="admin-card">
          <FiUsers size={40} />
          <h3>View Site</h3>
          <p>Return to the main website</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;