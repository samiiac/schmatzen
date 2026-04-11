import React from "react";
import { useQuery } from "@tanstack/react-query";
import ServiceCard from "../components/ServiceCard";
import { retrieveAllServices } from "../services/fetchService";

function Services() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: retrieveAllServices,
  });

  console.log(data);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          {data.services.services.map((service) => {
            return <ServiceCard key={service._id} service={service} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Services;
