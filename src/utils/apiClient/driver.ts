import { OrderData, OrderStatusUpdate } from "@/schemas/commonOrderSchemas";
import { ApiResult } from "./types";

export async function updateStatus({
  id,
  status,
}: {
  id: string;
  status: OrderStatusUpdate["status"];
}): Promise<ApiResult<OrderData>> {
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
