import { OrderData } from "@/schemas/commonOrderSchemas";
import { handleServerErrors } from "@/utils/formValidation";
import { BASE_URL } from "@/config";
import { ApiResultServer } from "@/utils/apiClient/types";
import { ManagerOrdersTable } from "@/components/ManagerOrdersTable";
import { cookies } from "next/headers";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/orders`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  const { error, data }: ApiResultServer<OrderData[]> = await res.json();

  if (!res.ok || !data) {
    handleServerErrors(error);
    return;
  }

  return (
    <div>
      <ManagerOrdersTable initialOrders={data} />
    </div>
  );
}
