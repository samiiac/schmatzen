import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllReservations,
  updateReservation,
} from "../services/reservationService";
import { useState } from "react";

function AdminReservations() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: getAllReservations,
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (reservation) => {
    setEditingId(reservation._id);
    setEditData({
      reservationStatus: reservation.reservationStatus,
      paymentStatus: reservation.paymentStatus,
    });
  };

  const handleSave = async (id) => {
    await updateReservation(id, editData);
    setEditingId(null);
    queryClient.invalidateQueries(["admin-reservations"]);
  };

  if (isLoading)
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  if (error)
    return (
      <div className="error-page">
        {error?.message || "Failed to load reservations"}
      </div>
    );

  const reservations = data?.reservations || [];

  return (
    <div className="page admin-reservations-page">
      <h1 className="page-title">All Reservations</h1>
      {reservations.length === 0 ? (
        <div className="empty-state-card">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>User</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r._id.slice(-6)}</td>
                  <td>{r.service?.name || "—"}</td>
                  <td>{r.user?.email?.split("@")[0] || "—"}</td>
                  <td>{r.serviceType}</td>
                  <td>{new Date(r.scheduledFor).toLocaleDateString()}</td>
                  <td>
                    {editingId === r._id ? (
                      <select
                        value={editData.reservationStatus}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            reservationStatus: e.target.value,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      r.reservationStatus
                    )}
                  </td>
                  <td>
                    {editingId === r._id ? (
                      <select
                        value={editData.paymentStatus}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            paymentStatus: e.target.value,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    ) : (
                      r.paymentStatus
                    )}
                  </td>
                  <td>NPR {r.totalAmount}</td>
                  <td>
                    {editingId === r._id ? (
                      <>
                        <button
                          onClick={() => handleSave(r._id)}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-outline btn-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(r)}
                        className="btn btn-outline btn-sm"
                      >
                        Edit
                      </button>
                    )}
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

export default AdminReservations;
