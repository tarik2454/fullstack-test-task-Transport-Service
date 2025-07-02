"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";

interface Order {
  id: string;
  status: string;
  updatedAt: string;
  client: Client;
  warehouse: Warehouse;
  manager: {
    firstName: string;
    lastName: string;
  };
  driver?: {
    firstName: string;
    lastName: string;
  };
}

interface Client {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const fetchAll = async () => {
    setLoading(true);

    const [ordersResult, clientsResult, warehousesResult] =
      await Promise.allSettled([
        fetch("/api/orders"),
        fetch("/api/clients"),
        fetch("/api/warehouses"),
      ]);

    if (ordersResult.status === "fulfilled" && ordersResult.value.ok) {
      const ordersData = await ordersResult.value.json();
      setOrders(
        ordersData
          .slice()
          .sort(
            (a: Order, b: Order) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );
    } else {
      message.warning("Failed to upload orders");
    }

    if (clientsResult.status === "fulfilled" && clientsResult.value.ok) {
      const clientsData = await clientsResult.value.json();
      setClients(clientsData);
    } else {
      message.warning("Failed to load clients");
    }

    if (warehousesResult.status === "fulfilled" && warehousesResult.value.ok) {
      const warehousesData = await warehousesResult.value.json();
      console.log(warehousesData);
      setWarehouses(warehousesData);
    } else {
      message.warning("Failed to load warehouses");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/orders/${editing.id}` : "/api/orders";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        message.error(error);
        return;
      }

      message.success(editing ? "Order updated" : "Order created");
      fetchAll();
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    message.success("Order deleted");
    fetchAll();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create
        </Button>
      </div>

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
          {
            title: "Client",
            dataIndex: ["client", "name"],
          },
          {
            title: "Warehouse",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "Manager",
            dataIndex: "manager",
            render: (manager: Order["manager"]) =>
              `${manager.firstName} ${manager.lastName}`,
          },
          {
            title: "Driver",
            dataIndex: "driver",
            render: (driver?: Order["driver"]) =>
              driver ? `${driver.firstName} ${driver.lastName}` : "—",
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Actions",
            render: (_, record: Order) => (
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => {
                    form.setFieldsValue(record);
                    setEditing(record);
                    setIsModalOpen(true);
                  }}
                >
                  Change
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "Change order" : "Create order"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="clientId"
            label="Client"
            rules={[{ required: true, message: "Choose a client" }]}
          >
            <Select
              placeholder="Choose a client"
              options={clients.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="warehouseId"
            label="Warehouse"
            rules={[{ required: true, message: "Choose a warehouse" }]}
          >
            <Select
              placeholder="Choose a warehouse"
              options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="NEW"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Choose a status"
              options={[
                { label: "NEW", value: "NEW" },
                { label: "IN_PROGRESS", value: "IN_PROGRESS" },
                { label: "COMPLETED", value: "COMPLETED" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
