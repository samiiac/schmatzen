import { z } from "zod";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const serviceSchema = z.object({
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