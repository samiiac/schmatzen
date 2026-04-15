import React from "react";
import { Link } from "react-router";
import { VscClose } from "react-icons/vsc";

function AdminSidebar({ toggleSidebar }) {
  return (
    <>
    
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={toggleSidebar}
      />

     
      <div className="bg-surface h-screen w-50 border-l fixed top-0 right-0 z-50 shadow-xl p-6">
        <div className="flex  gap-40 items-end justify-end mb-4  pb-4">
          
          <button onClick={toggleSidebar} className="text-xl">
            <VscClose/>
          </button>
        </div>

        <aside className="space-y-8">
          <nav>
            <h3 className="text-text uppercase text-lg font-normal tracking-widest mb-2">
              Services
            </h3>
            <ul className="flex flex-col gap-1 text-base">
              <li>
                <Link to="/admin/services" className="hover:text-accent">
                  View all services
                </Link>
              </li>
              <li>
                <Link to="/admin/services/add" className="hover:text-accent">
                  Add a service
                </Link>
              </li>
            </ul>
          </nav>

          <nav>
            <h3 className="text-text uppercase text-lg font-normal tracking-widest mb-2 ">
              Reservations
            </h3>
            <ul className="flex flex-col gap-1 text-base ">
              <li>
                <Link to="/admin/reservations" className="hover:text-accent">
                  View all reservations
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reservations/edit"
                  className="hover:text-accent "
                >
                  Edit reservation
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default AdminSidebar;
