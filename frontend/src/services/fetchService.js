import api from "./axios"

const addService = async (formData) => {
  try {
    const { data } = await api.post("/api/services", formData);
    if (data.success) {
      return { serviceAdded: true, error: null };
    }
    return { serviceAdded: false, error: data.message || "Failed to add service" };
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return { serviceAdded: false, error: msg };
  }
};

const editService = async (serviceId, formData) => {
  try {
    const { data } = await api.patch(`/api/services/${serviceId}`, formData);
    if (data.success) {
      return { serviceUpdated: true, error: null, data };
    }
    return { serviceUpdated: false, error: data.message || "Failed to update service" };
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return { serviceUpdated: false, error: msg };
  }
};

const retrieveAllServices = async () => {
  try {
    const response = await api.get("/api/services");
    const responseData = response.data;
    if (responseData && responseData.success) {
      return { services: responseData.services, error: null };
    }
    return { services: [], error: responseData?.message || "Failed to fetch services" };
  } catch (err) {
    return { services: [], error: err.response?.data?.message || err.message };
  }
};

const retrieveServiceDetails = async (serviceId) => {
  try {
    const { data } = await api.get(`/api/services/${serviceId}`);
    if (data && data.success !== false) {
      return { service: data.serviceDetails, error: null };
    }
    return { service: null, error: data?.message || "Service not found" };
  } catch (error) {
    console.log(error);
    return { service: null, error: error.response?.data?.message || error.message };
  }
};

const deleteService = async (serviceId) => {
  try {
    const { data } = await api.delete(`/api/services/${serviceId}`);
    if (data.success) return { success: true, error: null };
    return { success: false, error: data.message };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || err.message };
  }
};

export { addService, editService, retrieveAllServices, retrieveServiceDetails, deleteService };
