import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../AuthProvider";

function Profile() {
  const { user, logout } = useContext(UserAuthContext);

  return (
    <div className="page profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{user?.firstname?.charAt(0).toUpperCase()}</div>
        <h2>{user?.firstname} {user?.lastname}</h2>
        <p><strong>Email:</strong> {user?.email}</p>

        <div className="profile-links">
          <Link to="/my-reservations" className="btn btn-outline">My Bookings</Link>
          <Link to="/wishlist" className="btn btn-outline">Wishlist</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
