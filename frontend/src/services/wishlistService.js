import api from "./axios";

export async function getWishlist() {
  try {
    const { data } = await api.get("/api/wishlist");
    if (data.success) return { services: data.services, error: null };
    return { services: null, error: data.message || "Failed to load wishlist." };
  } catch (err) {
    return { services: null, error: err.response?.data?.message || err.message };
  }
}

export async function addToWishlist(serviceId) {
  try {
    const { data } = await api.post("/api/wishlist", { serviceId });
    return { success: data.success, error: data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
}

export async function removeFromWishlist(serviceId) {
  try {
    const { data } = await api.delete(`/api/wishlist/${serviceId}`);
    return { success: data.success, error: data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
}
