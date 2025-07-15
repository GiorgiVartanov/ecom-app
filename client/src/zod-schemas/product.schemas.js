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
    .string()
    .nonempty("price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && /^\d+(\.\d{1,2})?$/.test(val),
      { message: "price must be a positive number with up to 2 decimals" }
    ),
  stock: z
    .string()
    .nonempty("stock is required")
    .refine(
      (val) => !isNaN(parseInt(val, 10)) && Number.isInteger(Number(val)) && parseInt(val, 10) >= 0,
      { message: "stock must be a non-negative integer" }
    ),
  tags: z.array(tagSchema),
})
