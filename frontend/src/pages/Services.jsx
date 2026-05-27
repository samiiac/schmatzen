import React from "react";
import ServiceCard from "../components/ServiceCard";
import { retrieveAllServices } from "../services/fetchService";
import { useQuery } from "@tanstack/react-query";

function Services() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["services"],
    queryFn: retrieveAllServices,
  });

  if (isLoading) return <div className="loading-page"><div className="spinner" /></div>;
  if (isError) return <div className="error-page">Failed to load services: {error?.message}</div>;

  const allServices = data?.services || [];
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
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
