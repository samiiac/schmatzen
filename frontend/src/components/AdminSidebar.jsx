import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="bg-surface h-screen w-64 border-r fixed top-0 left-0 z-50 shadow-xl p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="space-y-6">
        <div>
          <h3 className="text-text uppercase text-sm font-semibold tracking-wider mb-2">
            Services
          </h3>
          <ul className="flex flex-col gap-1 text-base">
            <li>
              <Link to="/admin/services" className="hover:text-accent block py-1">
                Manage Services
              </Link>
            </li>
            <li>
              <Link to="/admin/services/add" className="hover:text-accent block py-1">
                Add Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-text uppercase text-sm font-semibold tracking-wider mb-2">
            Reservations
          </h3>
          <ul className="flex flex-col gap-1 text-base">
            <li>
              <Link to="/admin/reservations" className="hover:text-accent block py-1">
                All Reservations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-text uppercase text-sm font-semibold tracking-wider mb-2">
            Site
          </h3>
          <ul className="flex flex-col gap-1 text-base">
            <li>
              <Link to="/" className="hover:text-accent block py-1">
                View Website
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
