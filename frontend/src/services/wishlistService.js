import api from "./axios";

const getUserFriendlyError = (err) => {
  if (!err.response) {
    return "Network error. Please try again.";
  }

  const msg = err?.response?.data?.message || "";

  if (msg.includes("already")) {
    return "Already added to wishlist.";
  }

  if (msg.includes("Unauthorized")) {
    return "Please login first.";
  }

  if (msg.includes("No such")) {
    return "Service unavailable.";
  }

  return "Something went wrong.";
};

export async function getWishlist() {
  try {
    const { data } = await api.get("/api/wishlist");

    if (!data?.success) {
      return {
        wishlist: [],
        error: "Could not load wishlist.",
      };
    }

    return {
      wishlist: data.wishlist || [],
      error: null,
    };
  } catch (err) {
    return {
      wishlist: [],
      error: getUserFriendlyError(err),
    };
  }
}

// wishlistService.js
export async function addToWishlist(serviceId) {
  try {
    const { data } = await api.post("/api/wishlist", { serviceId });
    if (!data?.success)
      return { success: false, error: "Could not add to wishlist." };
    return {
      success: true,
      wishlistItemId: data.newWishlistItem._id, // ← return the _id
      error: null,
    };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

export async function removeFromWishlist(id) {
  try {
    const { data } = await api.delete(`/api/wishlist/${id}`);

    if (!data?.success) {
      return {
        success: false,
        error: "Could not remove item.",
      };
    }

    return {
      success: true,
      message: "Removed from wishlist.",
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyError(err),
    };
  }
}
