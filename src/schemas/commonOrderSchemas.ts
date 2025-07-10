import { z } from "zod";
import { clientSchema } from "./clientSchemas";
import { warehouseSchema } from "./warehouseSchemas";
import { OrderStatus } from "@prisma/client";

export const managerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const driverSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const orderSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
  updatedAt: z.string(),
  client: clientSchema,
  warehouse: warehouseSchema,
  manager: managerSchema,
  driver: driverSchema.optional(),
});

export const orderCreateSchema = z.object({
  clientId: z.string(),
  warehouseId: z.string(),
  status: z.nativeEnum(OrderStatus),
});

export const orderStatusUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
