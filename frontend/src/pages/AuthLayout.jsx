import React from "react";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div>
      <div>Pretend it's cool animation</div>
      <div className="form">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
