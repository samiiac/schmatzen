import React from "react";
import ServiceCard from "../components/ServiceCard";
import { retrieveAllServices } from "../services/fetchService";
import { getUserReservations } from "../services/reservationService";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { UserAuthContext } from "../AuthProvider";

function Services() {
  const { user } = useContext(UserAuthContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["services"],
    queryFn: retrieveAllServices,
  });

  const { data: reservationData } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: getUserReservations,
    enabled: !!user, // only fetch if logged in
  });

  if (isLoading) return <div className="loading-page"><div className="spinner" /></div>;
  if (isError) return <div className="error-page">Failed to load services: {error?.message}</div>;

  const allServices = data?.services || [];

  // set of service IDs the user has an active reservation for
  const bookedServiceIds = new Set(
    (reservationData?.reservations || [])
      .filter(r => ["pending", "confirmed"].includes(r.reservationStatus))
      .map(r => r.service?._id || r.service) // handles both populated and unpopulated
  );

  return (
    <div className="page services-page">
      <div className="page-header">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">Professional photography for every occasion</p>
      </div>
      {allServices.length === 0 ? (
        <div className="empty-state">
          <p>No services available right now.</p>
        </div>
      ) : (
        <div className="services-grid">
          {allServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              alreadyBooked={bookedServiceIds.has(service._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;