import { z } from "zod";

export const warehouseCreateSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
});

export const warehouseUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
});
