import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";

function Wishlist() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const services = data?.services || [];

  const handleRemove = async (serviceId) => {
    await removeFromWishlist(serviceId);
    refetch();
  };

  return (
    <div className="page wishlist-page">
      <h1 className="page-title">My Wishlist</h1>
      {isLoading && <div className="loading-page"><div className="spinner" /></div>}
      {error && <div className="error-page">{error}</div>}
      {!isLoading && services.length === 0 && (
        <div className="empty-state-card">
          <p>Your wishlist is empty.</p>
          <Link to="/services" className="btn btn-primary">Browse Services</Link>
        </div>
      )}
      <div className="wishlist-grid">
        {services.map((s) => (
          <div key={s._id} className="wishlist-card">
            <Link to={`/services/${s._id}`}>
              <img src={s.images?.[0] || ""} alt={s.name} className="wishlist-img" />
            </Link>
            <Link to={`/services/${s._id}`} className="wishlist-name">{s.name}</Link>
            <p className="wishlist-price">Basic ₹{s.pricing?.basic} · Premium ₹{s.pricing?.premium}</p>
            <button onClick={() => handleRemove(s._id)} className="btn btn-danger btn-sm">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
