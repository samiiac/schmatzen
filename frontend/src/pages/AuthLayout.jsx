import React from "react";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-white/5">
        <img
          src="/studio.jpg"
          alt="Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Brand Message */}
        <div className="relative z-10 p-20 flex flex-col justify-end h-full">
          <h1 className="text-accent text-5xl font-cursive mb-6">Schatzen</h1>
          <p className="text-text text-xl font-light leading-relaxed max-w-md tracking-wide italic">
            "We don't just take pictures; we curate memories, appreciating the
            beauty in the quiet moments."
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
