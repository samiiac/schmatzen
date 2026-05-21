import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuthContext } from "../AuthProvider";
import { CiMenuBurger } from "react-icons/ci";

function Navbar() {
  const { user, logout } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setMobileOpen(false); };
  const isAdmin = user?.role === "admin";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>Schatzen</Link>

          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <CiMenuBurger />
          </button>

          <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>

            {!user ? (
              <>
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/auth/signup" className="btn-primary" onClick={() => setMobileOpen(false)}
                  style={{padding:'6px 18px',borderRadius:'999px',fontSize:'.82rem',fontWeight:500,textDecoration:'none',
                    background:'linear-gradient(135deg,#e879f9,#f472b6)',color:'#fff',
                    boxShadow:'0 0 20px rgba(232,121,249,.3)',display:'inline-flex',alignItems:'center'}}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-reservations" onClick={() => setMobileOpen(false)}>My Bookings</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                {isAdmin && <Link to="/admin/services" onClick={() => setMobileOpen(false)}>Admin</Link>}
                <span className="nav-user">{user.firstname}</span>
                <button onClick={handleLogout} className="btn-outline" style={{padding:'5px 14px',borderRadius:'999px',fontSize:'.78rem',border:'1.5px solid rgba(167,139,250,.3)',background:'transparent',color:'#a78bfa',cursor:'pointer'}}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
