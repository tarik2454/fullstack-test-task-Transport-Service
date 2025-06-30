import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["MANAGER", "DRIVER"]),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const clientCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});
