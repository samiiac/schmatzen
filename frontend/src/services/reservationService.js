import api from "./axios";

export async function createReservation(data) {
  try {
    const { data: res } = await api.post("/api/reservations/", data);
    if (res.success) return { reservation: res.newReservation, error: null };
    return { reservation: null, error: res.message };
  } catch (err) {
    return { reservation: null, error: err.response?.data?.message || err.message };
  }
}

export async function getUserReservations() {
  try {
    const { data } = await api.get("/api/reservations/user");
    if (data.success) return { reservations: data.userReservations, error: null };
    return { reservations: null, error: data.message };
  } catch (err) {
    return { reservations: null, error: err.response?.data?.message || err.message };
  }
}

export async function getAllReservations() {
  try {
    const { data } = await api.get("/api/reservations/all");
    if (data.success) return { reservations: data.reservations, error: null };
    return { reservations: null, error: data.message };
  } catch (err) {
    return { reservations: null, error: err.response?.data?.message || err.message };
  }
}

export async function updateReservation(id, data) {
  try {
    const { data: res } = await api.patch(`/api/reservations/${id}`, data);
    if (res.success) return { reservation: res.updatedReservation, error: null };
    return { reservation: null, error: res.message };
  } catch (err) {
    return { reservation: null, error: err.response?.data?.message || err.message };
  }
}

export async function updateUserReservation(id, data) {
  try {
    const { data: res } = await api.patch(`/api/reservations/user/${id}`, data);
    if (res.success) return { reservation: res.updatedReservation, error: null };
    return { reservation: null, error: res.message };
  } catch (err) {
    return { reservation: null, error: err.response?.data?.message || err.message };
  }
}

export async function deleteReservation(id) {
  try {
    const { data } = await api.delete(`/api/reservations/${id}`);
    return { success: data.success, error: data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
}
