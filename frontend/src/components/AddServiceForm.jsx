import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addService, editService } from "../services/fetchService";
import { useNavigate, useParams } from "react-router-dom";
import { serviceSchema } from "../schemas/serviceSchema";
import { useQuery } from "@tanstack/react-query";
import { retrieveServiceDetails } from "../services/fetchService";

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


  const {
    data: service,
    isLoading,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => retrieveServiceDetails(id),
    enabled: edit && id != null,
    onSuccess: (data) => {
      reset({
        name: data.service.name,
        basic: data.service.pricing.basic,
        premium: data.service.pricing.premium,
        details: data.service.details,
        availability: data.service.availability.toString(),
      });
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

      console.log([...formData.entries()]);

      const response = edit ? await editService : await addService(formData);

      console.log(response);
      if (response.serviceAdded || response.serviceUpdated) {
        navigate("/services");
      } else {
        console.log(response.error);
        setError(response.error.message);
      }
    } catch (error) {
      console.log("Error while adding service", error);
    }
  }

  if (edit && isLoading) {
    return <p>..loading</p>;
  }

  return (
    <div>
      <form
        encType="multipart/form-data"
        method="POST"
        onSubmit={handleSubmit(handleServiceFormSubmit)}
      >
        <div>
          <label>Service Name:</label>
          <input {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Basic Service Price:</label>
          <input {...register("basic")} />
          {errors.basic && <p>{errors.basic.message}</p>}
        </div>

        <div>
          <label>Premium Service Price:</label>
          <input {...register("premium")} />
          {errors.premium && <p>{errors.premium.message}</p>}
        </div>

        <div>
          <label>Details:</label>
          <input {...register("details")} />
          {errors.details && <p>{errors.details.message}</p>}
        </div>

        <div>
          <label>Availability: </label>
          <label> True</label>
          <input
            {...register("availability")}
            name="availability"
            type="radio"
          />
          <label>False</label>
          <input
            {...register("availability")}
            name="availability"
            type="radio"
          />

          {errors.availability && <p>{errors.availability.message}</p>}
        </div>
        <div>
          <label>Service image: </label>
          <input
            {...register("image1")}
            type="file"
            accept=".jpg ,.jpeg , .png"
          ></input>

          {errors.image1 && <p>{errors.image1.message}</p>}
        </div>
        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {edit ? "Edit Service" : "Add Service"}
        </button>
      </form>
    </div>
  );
}

export default AddServiceForm;
