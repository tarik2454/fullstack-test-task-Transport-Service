import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});
export type RegisterData = z.infer<typeof registerSchema>;

export const registerResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
  }),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginData = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  user: z.object({
    email: z.string().email(),
    role: z.nativeEnum(Role),
  }),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const currentResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
  }),
});
export type CurrentResponse = z.infer<typeof currentResponseSchema>;
