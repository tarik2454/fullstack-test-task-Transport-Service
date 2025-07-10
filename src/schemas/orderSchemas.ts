// import { z } from "zod";
// import { OrderStatus } from "@prisma/client";

// export const orderCreateSchema = z.object({
//   clientId: z.string().min(2),
//   warehouseId: z.string().min(2),
//   status: z.nativeEnum(OrderStatus),
// });

// export const orderUpdateSchema = z.object({
//   clientId: z.string().min(2).optional(),
//   warehouseId: z.string().min(2).optional(),
//   status: z.nativeEnum(OrderStatus).optional(),
// });

// export const orderStatusUpdateSchema = z.object({
//   status: z.nativeEnum(OrderStatus),
// });

import { z } from "zod";
import { clientSchema } from "./clientSchemas";
import { warehouseSchema } from "./warehouseSchemas";

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
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED"]),
  updatedAt: z.string(),
  client: clientSchema,
  warehouse: warehouseSchema,
  manager: managerSchema,
  driver: driverSchema.optional(),
});

// Если тебе нужно создание заказа — отдельная схема, где ты передаёшь id клиента, склада и статус:
export const orderCreateSchema = z.object({
  clientId: z.string(),
  warehouseId: z.string(),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED"]),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;
