import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { retrieveServiceDetails } from "../services/fetchService";

function SingleService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => retrieveServiceDetails(id),
  });

  const service = data?.service;
  if (isLoading) return <div className="loading-page"><div className="spinner" /></div>;
  if (error) return <div className="error-page">Something went wrong.</div>;
  if (!service) return <div className="error-page">Service not found.</div>;

  return (
    <div className="page service-detail-page">
      <button onClick={() => navigate(-1)} className="btn-back">← Back to Services</button>
      <div className="service-detail">
        <div>
          <img className="main-img" src={service.images?.[0] || ""} alt={service.name} />
          <div className="thumb-row">
            {service.images?.map((img, i) => (
              <img key={i} src={img} alt="" className="thumb" />
            ))}
          </div>
        </div>
        <div>
          <h1>{service.name}</h1>
          <span className={service.availability ? "badge badge-available" : "badge badge-unavailable"}>
            {service.availability ? "Available Now" : "Unavailable"}
          </span>
          <p className="service-description">{service.details}</p>
          <div className="pricing-section">
            <div className="price-card">
              <h3 style={{fontSize:'1rem',marginBottom:'.25rem',color:'var(--muted)'}}>Basic Package</h3>
              <p className="price">NPR {service.pricing?.basic}</p>
              <ul><li>Digital delivery</li><li>Edited photos</li></ul>
            </div>
            <div className="price-card premium">
              <h3 style={{fontSize:'1rem',marginBottom:'.25rem',color:'var(--muted)'}}>Premium Package</h3>
              <p className="price">NPR {service.pricing?.premium}</p>
              <ul><li>Digital + Physical prints</li><li>Edited photos</li></ul>
            </div>
          </div>
          <button onClick={() => navigate(`/booking/${id}`)} className="btn btn-primary btn-lg btn-full">Book This Service</button>
        </div>
      </div>
    </div>
  );
}

export default SingleService;
