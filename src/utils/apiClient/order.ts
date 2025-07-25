import { OrderData, OrderCreate } from "@/schemas/commonOrderSchemas";
import { ApiResult } from "./types";

export async function getOrders(): Promise<ApiResult<OrderData[]>> {
  const res = await fetch("/api/orders");
  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error };
  }

  return { success: true, data };
}

export async function saveOrder(
  values: OrderCreate,
  editing?: OrderData
): Promise<ApiResult<OrderData>> {
  const method = editing ? "PUT" : "POST";
  const url = editing ? `/api/orders/${editing.id}` : "/api/orders";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error };
  }

  return { success: true, data };
}

export async function deleteOrder(id: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
  const { error } = await res.json();

  if (!res.ok) {
    return { success: false, error };
  }

  return { success: true, data: null };
}
