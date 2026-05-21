import api from "./axios";

export async function submitContact(formData) {
  try {
    const { data } = await api.post("/api/contact", formData);
    if (data.success) return { success: true, message: data.message, error: null };
    return { success: false, error: data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
}
