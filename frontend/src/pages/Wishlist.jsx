import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";

function Wishlist() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const wishlist = data?.wishlist || [];
  const fetchError = data?.error || null;

  const handleRemove = async (serviceId) => {
    const result = await removeFromWishlist(serviceId);
    if (result.success) {
      toast.success("Removed from wishlist.");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    } else {
      toast.error(result.error || "Could not remove item.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0118] px-4 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-50">My Wishlist</h1>
          <p className="text-purple-400 text-base mt-2">Services you've saved for later</p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-900 border-t-fuchsia-400 rounded-full animate-spin" />
          </div>
        )}

        {fetchError && (
          <p className="text-center text-red-400 text-base py-10">{fetchError}</p>
        )}

        {!isLoading && !fetchError && wishlist.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <p className="text-purple-400 text-base">Your wishlist is empty.</p>
            <Link
              to="/services"
              className="inline-block py-3 px-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all"
            >
              Browse Services
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => {
            const service = item.service || item;
            return (
              <div
                key={service._id}
                className="bg-[#1a0a2e] border border-purple-900/30 rounded-2xl overflow-hidden hover:border-fuchsia-900/50 transition-colors flex flex-col"
              >
                {/* Image */}
                <Link to={`/services/${service._id}`}>
                  <img
                    src={service.images?.[0] || ""}
                    alt={service.name}
                    className="w-full h-48 object-cover hover:scale-[1.03] transition-transform duration-300"
                  />
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <Link
                    to={`/services/${service._id}`}
                    className="text-purple-100 font-semibold text-base hover:text-fuchsia-400 transition-colors"
                  >
                    {service.name}
                  </Link>

                  <div className="flex gap-3 text-sm text-purple-500">
                    <span>Basic NPR {service.pricing?.basic}</span>
                    <span>·</span>
                    <span>Premium NPR {service.pricing?.premium}</span>
                  </div>

                  <div className="flex gap-2 mt-auto pt-2">
                    <Link
                      to={`/services/${service._id}`}
                      className="flex-1 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-xs text-center hover:brightness-110 hover:-translate-y-0.5 transition-all"
                    >
                      View Service
                    </Link>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="flex-1 py-2 rounded-full border border-red-900/40 text-red-400 text-xs font-semibold hover:border-red-600 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Wishlist;