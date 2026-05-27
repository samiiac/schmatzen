import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminServices from "./AdminServices";
import AddServiceForm from "../components/AddServiceForm";
import AdminReservations from "./AdminReservations";
import { useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();
  
  const renderContent = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return <AdminDashboard />;
    if (path.includes("/admin/services/add")) return <AddServiceForm edit={false} />;
    if (path.includes("/admin/services/edit")) return <AddServiceForm edit={true} />;
    if (path.startsWith("/admin/reservations")) return <AdminReservations />;
    if (path.startsWith("/admin/services")) return <AdminServices />;
    return <AdminDashboard />;
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", marginTop: "60px" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "2rem", marginLeft: "16rem" }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminLayout;