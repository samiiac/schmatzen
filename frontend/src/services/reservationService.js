import api from "./axios";

const getUserFriendlyError = (err) => {
  const msg = err?.response?.data?.message || "";

  // network failure
  if (!err.response) return "Network error. Try again.";

  // reservation-specific mapping
  if (msg.includes("No such objects")) {
    return "Selected service is not available.";
  }

  if (msg.includes("validation")) {
    return "Please check your input fields.";
  }

  if (msg.includes("Invalid credentials")) {
    return "Login failed. Check email or password.";
  }

  if (msg.includes("already exists")) {
    return "This item already exists.";
  }

  // fallback (never expose raw backend text)
  return "Request failed. Please try again.";
};

export async function createReservation(data) {
  try {
    const { data: res } = await api.post("/api/reservations/", data);

    if (!res?.success) {
      return {
        reservation: null,
        error: "Could not create reservation.",
      };
    }

    return {
      reservation: res.newReservation,
      message: "Reservation confirmed",
      error: null,
    };
  } catch (err) {
    return {
      reservation: null,
      error: getUserFriendlyError(err),
    };
  }
}

export async function getUserReservations() {
  try {
    const { data } = await api.get("/api/reservations/user");
    if (data.success)
      return { reservations: data.userReservations, error: null };
    return { reservations: null, error: data.message };
  } catch (err) {
    return {
      reservations: null,
      error: err.response?.data?.message || err.message,
    };
  }
}

export async function getUserReservationById(id) {
  try {
    const { data } = await api.get(`/api/reservations/${id}`);
    if (data.success) return { reservation: data.reservation, error: null };
    return { reservation: null, error: data.message };
  } catch (err) {
    return { reservation: null, error: err.response?.data?.message || err.message };
  }
}

export async function getAllReservations() {
  try {
    const { data } = await api.get("/api/reservations/all");
    if (data.success) return { reservations: data.reservations, error: null };
    return { reservations: null, error: data.message };
  } catch (err) {
    return {
      reservations: null,
      error: err.response?.data?.message || err.message,
    };
  }
}

export async function updateReservation(id, data) {
  try {
    const { data: res } = await api.patch(`/api/reservations/${id}`, data);
    if (res.success)
      return { reservation: res.updatedReservation, error: null };
    return { reservation: null, error: res.message };
  } catch (err) {
    return {
      reservation: null,
      error: err.response?.data?.message || err.message,
    };
  }
}

export const confirmReservationPayment = async (reservationId) => {
  const res = await fetch(`/api/reservations/pay/${reservationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};

export async function updateUserReservation(id, data) {
  try {
    const { data: res } = await api.patch(`/api/reservations/user/${id}`, data);
    if (res.success)
      return { reservation: res.updatedReservation, error: null };
    return { reservation: null, error: res.message };
  } catch (err) {
    return {
      reservation: null,
      error: err.response?.data?.message || err.message,
    };
  }
}

export async function deleteReservation(id) {
  try {
    const { data } = await api.delete(`/api/reservations/${id}`);
    return { success: data.success, error: data.message };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message,
    };
  }
}
