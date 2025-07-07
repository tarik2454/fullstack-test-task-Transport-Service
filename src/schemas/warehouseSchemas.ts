import { z } from "zod";

export const warehouseSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: z.string().min(2),
});

export const warehouseCreateSchema = warehouseSchema.omit({ id: true });

export type Warehouse = z.infer<typeof warehouseSchema>;
export type WarehouseCreate = z.infer<typeof warehouseCreateSchema>;
