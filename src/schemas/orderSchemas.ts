import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const orderCreateSchema = z.object({
  clientId: z.string().min(2),
  warehouseId: z.string().min(2),
  status: z.nativeEnum(OrderStatus),
});

export const orderUpdateSchema = z.object({
  clientId: z.string().min(1).optional(),
  warehouseId: z.string().min(1).optional(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
