export interface Warehouse {
  id: string;
  name: string;
  address: string;
}

interface SaveWarehousePayload {
  name: string;
  address: string;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export async function getWarehouses(): Promise<ApiResult<Warehouse[]>> {
  const res = await fetch("/api/warehouses");
  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error };
  }

  return { success: true, data };
}

export async function saveWarehouse(
  values: SaveWarehousePayload,
  editing?: Warehouse
): Promise<ApiResult<Warehouse>> {
  const method = editing ? "PUT" : "POST";
  const url = editing ? `/api/warehouses/${editing.id}` : "/api/warehouses";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const { data, success, error } = await res.json();

  if (!success) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function deleteWarehouse(id: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });
  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error };
  }

  return { success: true, data: null };
}
