import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addService, editService } from "../services/fetchService";
import { useNavigate, useParams } from "react-router-dom";
import { serviceSchema } from "../schemas/serviceSchema";
import { useQuery } from "@tanstack/react-query";
import { retrieveServiceDetails } from "../services/fetchService";

const inputCls = "w-full px-4 py-3 bg-[#0c0118] border border-[rgba(167,139,250,0.15)] rounded-xl text-[#f3e8ff] text-sm placeholder-purple-800 focus:outline-none focus:border-[#e879f9] focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)] transition-all";
const labelCls = "block text-[#a78bfa] text-sm font-medium mb-1.5";
const errorCls = "text-red-400 text-xs mt-1";

function AddServiceForm({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", resolver: zodResolver(serviceSchema) });

  const { isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => retrieveServiceDetails(id),
    enabled: edit && id != null,
    onSuccess: (data) => {
      const service = data?.service;
      if (service) {
        reset({
          name: service.name,
          basic: service.pricing.basic,
          premium: service.pricing.premium,
          details: service.details,
          availability: service.availability.toString(),
        });
      }
    },
  });

  async function handleServiceFormSubmit(data) {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("pricing[basic]", data.basic);
      formData.append("pricing[premium]", data.premium);
      formData.append("details", data.details);
      formData.append("availability", data.availability);
      formData.append("image1", data.image1[0]);

      const response = edit ? await editService(id, formData) : await addService(formData);

      if (response.serviceAdded || response.serviceUpdated) {
        navigate("/services");
      } else {
        setError(response.error?.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  if (edit && isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0118] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-900 border-t-fuchsia-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0118] px-4 py-12">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-50">
            {edit ? "Edit Service" : "Add New Service"}
          </h1>
          <p className="text-purple-500 text-sm mt-2">
            {edit ? "Update the service details below." : "Fill in the details to list a new service."}
          </p>
        </div>

        <form
          encType="multipart/form-data"
          method="POST"
          onSubmit={handleSubmit(handleServiceFormSubmit)}
          className="bg-[#1a0a2e] border border-[rgba(167,139,250,0.15)] rounded-2xl p-8 space-y-5"
        >
          {/* Service Name */}
          <div>
            <label className={labelCls}>Service Name</label>
            <input {...register("name")} placeholder="e.g. Wedding Photography" className={inputCls} />
            {errors.name && <p className={errorCls}>{errors.name.message}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Basic Price (NPR)</label>
              <input {...register("basic")} placeholder="5000" className={inputCls} />
              {errors.basic && <p className={errorCls}>{errors.basic.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Premium Price (NPR)</label>
              <input {...register("premium")} placeholder="10000" className={inputCls} />
              {errors.premium && <p className={errorCls}>{errors.premium.message}</p>}
            </div>
          </div>

          {/* Details */}
          <div>
            <label className={labelCls}>Details</label>
            <textarea
              {...register("details")}
              rows={4}
              placeholder="Describe what's included in this service…"
              className={inputCls}
            />
            {errors.details && <p className={errorCls}>{errors.details.message}</p>}
          </div>

          {/* Availability */}
          <div>
            <label className={labelCls}>Availability</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2.5 flex-1 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                "border-[rgba(167,139,250,0.15)] hover:border-[#e879f9]"
              }`}>
                <input
                  {...register("availability")}
                  type="radio"
                  value="true"
                  className="accent-fuchsia-500 w-4 h-4"
                />
                <span className="text-sm text-[#4ade80] font-medium">● Available</span>
              </label>
              <label className={`flex items-center gap-2.5 flex-1 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                "border-[rgba(167,139,250,0.15)] hover:border-[#e879f9]"
              }`}>
                <input
                  {...register("availability")}
                  type="radio"
                  value="false"
                  className="accent-fuchsia-500 w-4 h-4"
                />
                <span className="text-sm text-[#f87171] font-medium">● Unavailable</span>
              </label>
            </div>
            {errors.availability && <p className={errorCls}>{errors.availability.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Service Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[rgba(167,139,250,0.2)] rounded-xl cursor-pointer hover:border-fuchsia-600/50 hover:bg-fuchsia-950/10 transition-all">
              <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-purple-500 text-sm">Click to upload image</span>
              <span className="text-purple-700 text-xs mt-1">JPG, JPEG, PNG</span>
              <input
                {...register("image1")}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </label>
            {errors.image1 && <p className={errorCls}>{errors.image1.message}</p>}
          </div>

          {/* Global error */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/40 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-fuchsia-900/30 hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {edit ? "Saving…" : "Adding…"}
              </span>
            ) : (
              edit ? "Save Changes" : "Add Service"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddServiceForm;