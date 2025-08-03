import { ManagerWarehousesTable } from "@/components/ManagerWarehousesTable";
import { BASE_URL } from "@/config";
import { WarehouseData } from "@/schemas/warehouseSchemas";
import { ApiResultServer } from "@/utils/apiClient/types";
import { handleFormErrors } from "@/utils/formValidation";
import { cookies } from "next/headers";

export default async function WarehousesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/warehouses`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  const { data, error }: ApiResultServer<WarehouseData[]> = await res.json();

  if (!res.ok || !data) {
    handleFormErrors(error);
    return;
  }

  console.log(data);

  return (
    <div>
      <ManagerWarehousesTable initialWarehouses={data} />
    </div>
  );
}
