import { z } from "zod";

// Regex
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
const phoneRegex = /^[0-9]{10,11}$/;

/* =======================
   LOGIN SCHEMA
======================= */
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* =======================
   REGISTER SCHEMA
======================= */
export const registerSchema = z.object({
   firstName: z
  .string()
  .min(2, "First name must be at least 2 characters")
  .max(30, "First name must not exceed 30 characters")
  .regex(nameRegex, "First name must contain only letters"),

   middleName: z
    .string()
    .max(30, "Middle name must not exceed 30 characters")
    .regex(nameRegex, "Middle name must contain only letters")
    .optional()
    .or(z.literal("")), // allow empty
  
   lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters")
    .regex(nameRegex, "Last name must contain only letters"),
  
   phoneNumber: z
    .string()
    .regex(phoneRegex, "Phone number must be 10–11 digits")
    .optional()
    .or(z.literal("")),
   email: z.email("Invalid email"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 2_000_000, "Max file size is 2MB"),
});

