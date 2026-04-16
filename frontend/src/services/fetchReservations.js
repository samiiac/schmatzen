import api from "./axios";

export async function retrieveAllReservations() {
  try {
    const { data } = await api.get("api/reservations/all");
    if (data.success) {
      return { reservations: data, error: null };
    } else {
      return { reservations: null, error: "fetch failed" };
    }
  } catch (err) {
    console.log(err.response.data);
    return { reservations: null, error: err.response.data };
  }
}

export async function retrieveUserReservations() {
  try {
    const { data } = await api.get("api/reservations");
    if (data.success) {
      return { userReservations: data, error: null };
    } else {
      return { userReservations: null, error: "fetch failed" };
    }
  } catch (err) {
    console.log(err.response.data);
    return { userReservations: null, error: err.response.data };
  }
}
