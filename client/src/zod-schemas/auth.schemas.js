import { z } from "zod"

export const signUpSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(3, { message: "Name must be at least 3 characters" })
      .max(20, { message: "Name must be at most 20 characters" }),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, { message: "Password must be at least 8 characters" })
      .max(50, { message: "Password must be at most 50 characters" }),
    confirmPassword: z.string().nonempty("Password Confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
})
