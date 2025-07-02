import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const orderCreateSchema = z.object({
  clientId: z.string().min(2),
  warehouseId: z.string().min(2),
  status: z.nativeEnum(OrderStatus),
});

export const orderUpdateSchema = z.object({
  clientId: z.string().min(2).optional(),
  warehouseId: z.string().min(2).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
