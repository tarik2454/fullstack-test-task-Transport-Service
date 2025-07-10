import { z } from "zod";

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: z.string().min(2),
  phone: z.string().min(2),
});
export type Client = z.infer<typeof clientSchema>;

export const clientCreateSchema = clientSchema.omit({ id: true });
export type ClientCreate = z.infer<typeof clientCreateSchema>;
