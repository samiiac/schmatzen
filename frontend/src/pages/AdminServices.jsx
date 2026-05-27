import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { retrieveAllServices } from "../services/fetchService";
import { deleteService } from "../services/fetchService";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

function AdminServices() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-services"],
    queryFn: retrieveAllServices,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => queryClient.invalidateQueries(["admin-services"]),
  });

  const services = data?.services || [];

  if (isLoading) return <div className="loading-page"><div className="spinner" /></div>;
  if (isError) return <div className="error-page">{error?.message || "Failed to load services"}</div>;

  return (
    <div className="page admin-services-page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="page-title">Manage Services</h1>
        <button onClick={() => navigate("/admin/services/add")} className="btn btn-primary">
          <FiPlus /> Add New
        </button>
      </div>

      {services.length === 0 ? (
        <div className="empty-state-card">
          <p>No services found.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Basic</th>
                <th>Premium</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>
                    {service.images?.[0] ? (
                      <img src={service.images[0]} alt={service.name} style={{ height: "50px", width: "50px", objectFit: "cover" }} />
                    ) : "—"}
                  </td>
                  <td>{service.name}</td>
                  <td>₹{service.pricing?.basic}</td>
                  <td>₹{service.pricing?.premium}</td>
                  <td>{service.availability ? "Available" : "Unavailable"}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/services/edit/${service._id}`)}
                      className="btn btn-outline btn-sm"
                      style={{ marginRight: "0.5rem" }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(service._id)}
                      className="btn btn-danger btn-sm"
                      disabled={deleteMutation.isPending}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminServices;