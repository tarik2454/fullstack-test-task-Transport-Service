import { Client } from "@/schemas/clientSchemas";

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export async function getClients(): Promise<ApiResult<Client[]>> {
  const res = await fetch("/api/clients");
  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function saveClient(
  values: Client,
  editing?: Client
): Promise<ApiResult<Client>> {
  const method = editing ? "PUT" : "POST";
  const url = editing ? `/api/clients/${editing.id}` : "/api/clients";

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

// export async function deleteWarehouse(id: string): Promise<ApiResult<null>> {
//   const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });
//   const { error } = await res.json();

//   if (!res.ok) {
//     return { success: false, error: error };
//   }

//   return { success: true, data: null };
// }
