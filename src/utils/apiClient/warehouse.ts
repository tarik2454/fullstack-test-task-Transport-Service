import { Warehouse } from "@/schemas/warehouseSchemas";

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export async function getWarehouses(): Promise<ApiResult<Warehouse[]>> {
  const res = await fetch("/api/warehouses");
  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function saveWarehouse(
  values: Warehouse,
  editing?: Warehouse
): Promise<ApiResult<Warehouse>> {
  const method = editing ? "PUT" : "POST";
  const url = editing ? `/api/warehouses/${editing.id}` : "/api/warehouses";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function deleteWarehouse(id: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });
  const { error } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: null };
}
