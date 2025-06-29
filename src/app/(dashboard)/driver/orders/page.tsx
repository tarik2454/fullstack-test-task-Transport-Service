"use client";

import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";

interface Order {
  id: string;
  warehouse: { name: string };
  client: { name: string };
  status: string;
}

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
    if (res.ok) {
      message.success("Статус обновлен");
      fetchOrders();
    } else {
      message.error("Ошибка");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Доступные и текущие заказы</h2>
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
            render: (_: unknown, __: Order, index: number) => index + 1,
            width: 50,
          },
          { title: "Клиент", dataIndex: ["client", "name"] },
          { title: "Склад", dataIndex: ["warehouse", "name"] },
          { title: "Статус", dataIndex: "status" },
          {
            title: "Действия",
            render: (_, record: Order) => {
              switch (record.status) {
                case "NEW":
                  return (
                    <Button onClick={() => updateStatus(record.id, "ASSIGNED")}>
                      Принять
                    </Button>
                  );
                case "ASSIGNED":
                  return (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateStatus(record.id, "IN_PROGRESS")}
                      >
                        В процессе
                      </Button>
                      <Button
                        danger
                        onClick={() => updateStatus(record.id, "NEW")}
                      >
                        Отклонить
                      </Button>
                    </div>
                  );
                case "IN_PROGRESS":
                  return (
                    <Button
                      type="primary"
                      onClick={() => updateStatus(record.id, "COMPLETED")}
                    >
                      Завершить
                    </Button>
                  );
                case "COMPLETED":
                  return <span className="text-green-600">Выполнен</span>;
              }
            },
          },
        ]}
      />
    </div>
  );
}
