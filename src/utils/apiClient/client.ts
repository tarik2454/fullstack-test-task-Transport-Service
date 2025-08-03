import { ClientData } from "@/schemas/clientSchemas";
import { ApiResult } from "./types";

export async function getClients(): Promise<ApiResult<ClientData[]>> {
  const res = await fetch("/api/clients");
  const { error, data } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function saveClient(
  values: ClientData,
  editing?: ClientData
): Promise<ApiResult<ClientData>> {
  const method = editing ? "PUT" : "POST";
  const url = editing ? `/api/clients/${editing.id}` : "/api/clients";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const { error, data } = await res.json();

  console.log(data);

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}

export async function deleteClient(id: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
  const { error } = await res.json();

  if (!res.ok) {
    return { success: false, error: error };
  }

  return { success: true, data: null };
}
