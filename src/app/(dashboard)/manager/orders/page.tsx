"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";

interface Order {
  id: string;
  status: string;
  updatedAt: string;
  client: Client;
  warehouse: Warehouse;
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
    try {
      const [ordersRes, clientsRes, warehousesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/clients"),
        fetch("/api/warehouses"),
      ]);

      if (!ordersRes.ok || !clientsRes.ok || !warehousesRes.ok) {
        const errorText = await ordersRes.text();
        console.error("Ошибка при загрузке данных:", errorText);
        message.error("Ошибка при загрузке данных");
        return;
      }

      const ordersData = await ordersRes.json();
      const clientsData = await clientsRes.json();
      const warehousesData = await warehousesRes.json();

      setOrders(
        ordersData
          .slice()
          .sort(
            (a: Order, b: Order) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );

      setClients(clientsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error("Ошибка при fetchAll:", error);
      message.error("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
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
        message.error(error || "Ошибка при сохранении заказа");
        return;
      }

      message.success(editing ? "Заказ обновлен" : "Заказ создан");
      fetchAll();
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (err) {
      console.warn("Валидация не прошла", err);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error || "Ошибка при удалении заказа");
      return;
    }

    message.success("Заказ удалён");
    fetchAll();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Заказы</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Создать
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
            title: "Клиент",
            dataIndex: ["client", "name"],
          },
          {
            title: "Склад",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "Статус",
            dataIndex: "status",
          },
          {
            title: "Действия",
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
                  Изменить
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Удалить
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "Изменить заказ" : "Создать заказ"}
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
            label="Клиент"
            rules={[{ required: true, message: "Выберите клиента" }]}
          >
            <Select
              placeholder="Выберите клиента"
              options={clients.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="warehouseId"
            label="Склад"
            rules={[{ required: true, message: "Выберите склад" }]}
          >
            <Select
              placeholder="Выберите склад"
              options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: "Выберите статус" }]}
          >
            <Select
              placeholder="Выберите статус"
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
