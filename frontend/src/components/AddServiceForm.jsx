import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addService } from "../services/fetchService";
import { useNavigate } from "react-router-dom";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const serviceSchema = z.object({
  name: z.string().min(5, "Name cannot be empty.").trim(),
  basic: z.coerce.number().positive("Price must be positive"),
  premium: z.coerce.number().positive("Price must be positive"),
  details: z.string(),
  availability: z.coerce.boolean(),
  image1: z
    .any()
    .refine((files) => files?.length > 0, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Exceeds the maximum limit",
    )
    .refine(
      (files) => allowedTypes.includes(files?.[0]?.type),
      "The file type isnt allowed.",
    ),
});

function AddServiceForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", resolver: zodResolver(serviceSchema) });

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

      const response = await addService(formData);

      console.log(response);
      if (response.serviceAdded) {
        navigate("/services");
      } else {
        console.log(response.error);
        setError(response.error.message);
      }
    } catch (error) {
      console.log("Error while adding service", error);
    }
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
          Add
        </button>
      </form>
    </div>
  );
}

export default AddServiceForm;
