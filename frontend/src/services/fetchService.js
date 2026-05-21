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
    const { data } = await api.get("/api/services");
    if (data.success) {
      return { services: data, error: null };
    }
  } catch (error) {
    return { services: null, error: error.response?.data?.message || error.message };
  }
};

const retrieveServiceDetails = async (serviceId) => {
  try {
    const { data } = await api.get(`/api/services/${serviceId}`);
    if (data.success) {
      return { service: data.serviceDetails, error: null };
    }
  } catch (error) {
    console.log(error);
    return { service: null, error: error.response?.data?.message || error.message };
  }
};

export { addService, editService, retrieveAllServices, retrieveServiceDetails };
