"use client";

import { useEffect, useState } from "react";
import { Table, message, Select } from "antd";

interface Order {
  id: string;
  warehouse: { name: string };
  client: { name: string };
  status: string;
}

const statusOptions = [
  { label: "NEW", value: "NEW" },
  { label: "ASSIGNED", value: "ASSIGNED" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
];

export default function DriverOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/driver/orders");
    const data = await res.json();

    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    message.success("Order status updated");
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Available and current orders
      </h2>
      <Table
        rowKey="id"
        dataSource={Array.isArray(orders) ? orders : []}
        loading={loading}
        bordered
        columns={[
          {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_: unknown, __: Order, index: number) => index + 1,
            width: 50,
          },
          { title: "Client", dataIndex: ["client", "name"] },
          { title: "Warehouse", dataIndex: ["warehouse", "name"] },
          {
            title: "Status",
            dataIndex: "status",
            render: (status: string, record: Order) => (
              <Select
                value={status}
                onChange={(value) => updateStatus(record.id, value)}
                options={statusOptions}
                disabled={status === "COMPLETED"}
                size="small"
                style={{ width: 160 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
