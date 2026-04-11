import api from "./axios";

export async function loginUser(userData) {
  try {
    const response = await api.post("api/auth/login", userData);

    if (response.data.success) {
      const { token, role, firstname, email } = response.data;
      return { user: { token, role, firstname, email }, error: null };
    }
    return { user: null, error: response.data.message };
  } catch (err) {
    console.log("error.response.data", err.response.data);
    return { user: null, error: err.response.data.message };
  }
}

export async function registerUser(userData) {
  try {
    const { confirmPassword, ...payload } = userData;
    console.log(payload);
    const response = await api.post("api/auth/register", payload);

    if (response.data.success) {
      const { token, role, firstname, email } = response.data;
      return { user: { token, role, firstname, email }, error: null };
    }
    return { user: null, error: response.data.message };
  } catch (err) {
    let errMessage = err.response.data;
    if (errMessage.message.includes("E11000")) {
      return {
        user: null,
        error: "The account with this phone number already exists",
      };
    }
    console.log("Error while registering user ", errMessage);
    return { user: null, error: errMessage.message };
  }
}
