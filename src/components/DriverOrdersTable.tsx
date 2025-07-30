"use client";

import { useState } from "react";
import { Table, message, Select } from "antd";
import { OrderData } from "@/schemas/commonOrderSchemas";
import { updateStatus } from "@/utils/apiClient/driver";
import { handleFormErrors } from "@/utils/formValidation";
import { upsertToTop } from "@/utils/upsertToTop";
import { OrderStatus } from "@prisma/client";

const statusOptions = [
  { label: "NEW", value: "NEW" },
  { label: "ASSIGNED", value: "ASSIGNED" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
];

export function DriverOrdersTable({
  initialOrders,
}: {
  initialOrders: OrderData[];
}) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    setLoading(true);

    const res = await updateStatus({ id, status });

    if (!res.success) {
      handleFormErrors(res.error);
      return;
    }

    message.success("Updated");

    setOrders((prev) =>
      upsertToTop(prev, res.data, (order) => order.id === res.data.id)
    );

    setLoading(false);
  };

  return (
    <Table
      rowKey="id"
      dataSource={orders}
      loading={loading}
      bordered
      columns={[
        {
          title: "#",
          dataIndex: "index",
          key: "index",
          render: (_: unknown, __: OrderData, index: number) => index + 1,
          width: 50,
        },
        { title: "Client", dataIndex: ["client", "name"] },
        { title: "Warehouse", dataIndex: ["warehouse", "name"] },
        {
          title: "Status",
          dataIndex: "status",
          render: (status: string, record: OrderData) => (
            <Select
              value={status as OrderStatus}
              onChange={(value) => handleUpdateStatus(record.id, value)}
              options={statusOptions}
              disabled={status === "COMPLETED"}
              size="small"
              style={{ width: 160 }}
            />
          ),
        },
      ]}
    />
  );
}
