import { z } from "zod";

export const clientCreateSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  phone: z.string().min(2),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  phone: z.string().min(2).optional(),
});
