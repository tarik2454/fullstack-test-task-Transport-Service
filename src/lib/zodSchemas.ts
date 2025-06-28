import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["MANAGER", "DRIVER"]),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
