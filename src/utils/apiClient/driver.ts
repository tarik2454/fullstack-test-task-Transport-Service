import { Order, OrderStatusUpdate } from "@/schemas/commonOrderSchemas";

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export async function getDriverOrders(): Promise<ApiResult<Order[]>> {
  const res = await fetch("/api/driver/orders");

  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }
  return { success: true, data: data };
}

export async function updateStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<ApiResult<OrderStatusUpdate>> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}
