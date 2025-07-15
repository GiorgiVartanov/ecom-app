import { z } from "zod"

export const tagSchema = z.object({
  key: z.string().nonempty(" "),
  value: z.string().nonempty(" "),
  isSearchable: z.boolean().optional(),
  id: z.string().optional(),
  keyId: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().nonempty("name is required"),
  description: z.string().optional(),
  price: z
    .number()
    .positive("price must be a positive number")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toFixed(2)), {
      message: "price must have up to 2 decimals",
    }),
  stock: z.number().int("stock must be an integer").min(0, "stock must be a non-negative integer"),
  tags: z.array(tagSchema),
})
