import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

import { UserAuthContext } from "../AuthProvider";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

function ServiceCard({ service, alreadyBooked = false }) {
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  // add this state
  const [wishlistItemId, setWishlistItemId] = useState(null);

  // update the useEffect
  useEffect(() => {
    if (!user || !service?._id) return;
    const fetchWishlist = async () => {
      const result = await getWishlist();
      if (result.error) {
        setWishlistError(result.error);
        return;
      }
      const list = result.wishlist || [];
      const found = list.find(
        (item) =>
          item.service?._id === service._id || item.service === service._id,
      );
      setIsInWishlist(!!found);
      setWishlistItemId(found?._id || null); // ← store wishlist doc _id
    };
    fetchWishlist();
  }, [user, service?._id]);

  // update handleWishlistClick — use wishlistItemId to remove
  const handleWishlistClick = async () => {
  if (!user) { toast.error("Please login first."); return; }
  setWishlistLoading(true);
  setWishlistError(null);
  try {
    if (isInWishlist) {
      const result = await removeFromWishlist(wishlistItemId); // ← wishlist _id not service._id
      setWishlistLoading(false);
      if (result.success) {
        setIsInWishlist(false);
        setWishlistItemId(null);
        toast.success("Removed from wishlist.");
        return;
      }
      setWishlistError(result.error); toast.error(result.error); return;
    }
    const result = await addToWishlist(service._id);
    setWishlistLoading(false);
    if (result.success) {
      setIsInWishlist(true);
      setWishlistItemId(result.wishlistItemId); // ← store returned _id on add
      toast.success("Added to wishlist.");
      return;
    }
    setWishlistError(result.error); toast.error(result.error);
  } catch {
    setWishlistLoading(false);
    toast.error("Something went wrong.");
  }
};

 

  if (!service) return <div className="error-page">Service not found.</div>;

  return (
    <div className="service-card">
      <Link to={`/services/${service._id}`}>
        <img
          style={{
            height: "260px",
            width: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform .3s",
          }}
          src={service.images?.[0] || ""}
          alt={service.name}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "")}
        />
      </Link>

      <div className="p-4">
        <Link
          to={`/services/${service._id}`}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              fontSize: "1.05rem",
              color: "var(--text)",
              marginBottom: ".5rem",
            }}
          >
            {service.name}
          </h3>
        </Link>

        <div style={{ display: "flex", gap: ".85rem", marginBottom: ".4rem" }}>
          <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            Basic NPR {service.pricing?.basic}
          </span>
          <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            Premium NPR {service.pricing?.premium}
          </span>
        </div>

        <p
          style={{
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: ".75rem",
            fontWeight: 600,
            color: service.availability ? "var(--success)" : "var(--danger)",
          }}
        >
          {service.availability ? "● Available" : "● Unavailable"}
        </p>

        <div className="flex gap-3 mt-6">
          {/* Book Now / Already Booked */}
          {alreadyBooked ? (
            <button
              onClick={() => navigate("/my-reservations")}
              className="flex-1 py-2.5 rounded-full border border-purple-700/50 text-purple-400 text-xs font-semibold uppercase tracking-wide transition-all duration-200 hover:border-fuchsia-500 hover:text-fuchsia-400"
            >
              View Booking
            </button>
          ) : (
            <button
              onClick={() => navigate(`/booking/${service._id}`)}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#e879f9] to-[#f472b6] text-white text-xs font-semibold uppercase tracking-wide shadow-[0_0_20px_rgba(232,121,249,0.25)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(232,121,249,0.45)] hover:-translate-y-px"
            >
              Book Now
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isInWishlist
                ? "bg-[#e879f9] text-white shadow-[0_0_12px_rgba(232,121,249,0.6)]"
                : "bg-[#1a0a2e] border border-[rgba(167,139,250,0.3)] text-[#e879f9] hover:border-[#e879f9] hover:bg-[rgba(232,121,249,0.1)]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {wishlistLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isInWishlist ? (
              <FaHeart className="text-sm" />
            ) : (
              <CiHeart className="text-2xl" />
            )}
          </button>
        </div>

        {wishlistError && (
          <p className="text-red-400 text-sm mt-2">{wishlistError}</p>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;
