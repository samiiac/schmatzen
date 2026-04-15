import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../AuthProvider";
import AdminSidebar from "./AdminSidebar";

import { CiMenuBurger } from "react-icons/ci";

function Navbar() {
  const { user } = useContext(UserAuthContext);
  const [collapse, setCollapse] = useState(true);
  const isLoggedIn = user ? true : false;
  const isAdmin = isLoggedIn && user.role == "admin";

  function toggleCollapse() {
    setCollapse((prev) => !prev);
  }
  return (
    <>
      <nav className="py-2 px-12 text-text flex justify-between items-center border-b h-[70px]">
        <Link to="/" className="studio-name text-xl text-accent">
          Schatzen
        </Link>

        <div className="nav-r flex gap-12 font-light text-base tracking-[0.1em]">
          {!isAdmin && (
            <Link to="/services" className="hover:border-b border-muted">
              Services
            </Link>
          )}
          {isAdmin ? (
            <button onClick={toggleCollapse}>
              <CiMenuBurger />
            </button>
          ) : isLoggedIn ? (
            <>
              <Link to="/services" className="hover:border-b border-muted">
                Reservations
              </Link>
              <Link to="">{user.email}</Link>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:border-b border-muted">
                Contact
              </Link>
              <Link
                to="/auth/login"
                className="border border-accent/30 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:bg-accent hover:text-black"
              >
                Book now
              </Link>
            </>
          )}
        </div>
      </nav>
      {isAdmin && !collapse && (
        <AdminSidebar toggleSidebar={() => setCollapse(true)} />
      )}
    </>
  );
}

export default Navbar;
