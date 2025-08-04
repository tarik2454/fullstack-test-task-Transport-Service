import { cookies } from "next/headers";
import { DriverOrdersTable } from "@/components/DriverOrdersTable";
import { OrderData } from "@/schemas/commonOrderSchemas";
import { handleServerErrors } from "@/utils/formValidation";
import { BASE_URL } from "@/config";
import { ApiResultServer } from "@/utils/apiClient/types";

export default async function DriverOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/driver/orders`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  const { data, error }: ApiResultServer<OrderData[]> = await res.json();

  if (!res.ok || !data) {
    handleServerErrors(error);
    return;
  }

  return (
    <div>
      <DriverOrdersTable initialOrders={data} />
    </div>
  );
}
