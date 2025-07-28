import { ManagerClientsTable } from "@/components/ManagerClientsTable";
import { BASE_URL } from "@/config";
import { ClientData } from "@/schemas/clientSchemas";
import { ApiResultServer } from "@/utils/apiClient/types";
import { handleFormErrors } from "@/utils/formValidation";
import { cookies } from "next/headers";

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/clients`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  const { error, data }: ApiResultServer<ClientData[]> = await res.json();

  if (!res.ok || !data) {
    handleFormErrors(error);
    return;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Clients</h2>
      <ManagerClientsTable initialClients={data} />
    </div>
  );
}
