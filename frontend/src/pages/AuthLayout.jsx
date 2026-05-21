import React, { useContext, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <button onClick={() => navigate("/")} style={{
        position:'absolute',top:'1.5rem',left:'2rem',
        background:'none',border:'none',color:'var(--muted)',
        cursor:'pointer',fontSize:'.9rem'
      }}>← Back to Home</button>
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
