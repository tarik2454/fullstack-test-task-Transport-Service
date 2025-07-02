import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
