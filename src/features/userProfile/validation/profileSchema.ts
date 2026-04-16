import { z } from "zod";

// Regex
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
const phoneRegex = /^[0-9]{10,11}$/;

// ================= PROFILE =================
export const profileSchema = z
  .object({
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
    bio: z.string().max(160, "Bio must not exceed 160 characters").optional(),  
  })
  .refine(
    (data) =>
      data.firstName ||
      data.middleName ||
      data.lastName ||
      data.phoneNumber ||
      data.bio,
      
    {
      message: "At least one field must be updated",
    }
  );

// ================= EMAIL =================
export const emailSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ================= PASSWORD =================
export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
});
