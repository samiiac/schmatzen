import React,{useState,useContext,useEffect} from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { UserAuthContext } from "../AuthProvider";
import { getWishlist } from "../services/wishlistService";
import { addToWishlist } from "../services/wishlistService";

function ServiceCard({ service }) {
  const { serviceId } = useParams();
  const { user } = useContext(UserAuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  // const { data, isLoading } = useQuery({
  //   queryKey: ["service", serviceId],
  //   queryFn: () => retrieveServiceDetails(serviceId),
  //   enabled: !!serviceId,
  // });
  // const service = data?.service;

  // Fetch wishlist to check if this service is already added
  useEffect(() => {
    if (!user || !serviceId) return;
    const fetchWishlist = async () => {
      const result = await getWishlist();
      if (result.success && result.wishlist) {
        const found = result.wishlist.some(
          (item) => item.service._id === serviceId,
        );
        setIsInWishlist(found);
      }
    };
    fetchWishlist();
  }, [user, serviceId]);

  const handleWishlistClick = async () => {
    if (!user) {
      // Redirect to login or show message
      alert("Please log in to add to wishlist.");
      // window.location.href = "/login";
      return;
    }
    if (isInWishlist) {
      alert("This service is already in your wishlist.");
      return;
    }
    setWishlistLoading(true);
    setWishlistError(null);
    const result = await addToWishlist(serviceId);
    setWishlistLoading(false);
    if (result.success) {
      setIsInWishlist(true);
      // Optional: show success toast
    } else {
      setWishlistError(result.error);
      alert(result.error);
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
            Basic NPR{service.pricing?.basic}
          </span>
          <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>
            Premium NPR{service.pricing?.premium}
          </span>
        </div>
        <p
          style={{
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: ".75rem",
            color: service.availability ? "var(--success)" : "var(--danger)",
            fontWeight: 600,
          }}
        >
          {service.availability ? "● Available" : "● Unavailable"}
        </p>

        <div className="flex gap-3 mt-6">
          {/* Book Now */}
          <button
            onClick={() => (window.location.href = `/booking/${service._id}`)}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#e879f9] to-[#f472b6] text-white text-xs font-semibold uppercase tracking-wide shadow-[0_0_20px_rgba(232,121,249,0.25)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(232,121,249,0.45)] hover:-translate-y-px"
          >
            Book Now
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isInWishlist
                ? "bg-[#e879f9] text-white border-none shadow-[0_0_12px_rgba(232,121,249,0.6)]"
                : "bg-[#1a0a2e] border border-[rgba(167,139,250,0.3)] text-[#e879f9] hover:border-[#e879f9] hover:bg-[rgba(232,121,249,0.1)]"
            } hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed`}
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
