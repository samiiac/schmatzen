import api from "./axios";

const getErrorMessage = (err) => {
  if (!err.response) {
    return "Network error. Try again.";
  }

  const data = err.response.data;


  if (data?.message) {
    console.log(data.message);
    return data.message;
  }

  return "Something went wrong.";
};

export async function loginUser(userData) {
  try {
    const response = await api.post("/api/auth/login", userData);

    const { success, token, role, firstname, email, message } = response.data;

    if (!success) {
      return { user: null, error: message || "Login failed" };
    }

    return {
      user: { token, role, firstname, email },
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: getErrorMessage(err),
    };
  }
}

export async function registerUser(userData) {
  try {
    const { confirmPassword, ...payload } = userData;

    const response = await api.post("/api/auth/register", payload);

    const { success, token, role, firstname, email, message } =
      response.data;

    if (!success) {
      return { user: null, error: message || "Registration failed" };
    }

    return {
      user: { token, role, firstname, email },
      error: null,
    };
  } catch (err) {
    const raw = err?.response?.data?.message || "";

    // Mongo duplicate key error handling (E11000)
    if (raw.includes("E11000")) {
      return {
        user: null,
        error: "Account already exists.",
      };
    }

    // validation errors (optional pattern)
    if (raw.toLowerCase().includes("validation")) {
      return {
        user: null,
        error: "Invalid input data.",
      };
    }

    return {
      user: null,
      error: getErrorMessage(err),
    };
  }
}