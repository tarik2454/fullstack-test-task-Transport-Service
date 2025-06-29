"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";

interface Order {
  id: string;
  warehouseId: string;
  clientId: string;
  status: string;
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
        message.error("Ошибка при загрузке данных");
        return;
      }

      const ordersData = await ordersRes.json();
      const clientsData = await clientsRes.json();
      const warehousesData = await warehousesRes.json();

      setOrders(ordersData);
      setClients(clientsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error("Ошибка при fetchAll:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      message.success("Заказ создан");
      fetchAll();
      setIsModalOpen(false);
      form.resetFields();
    } else {
      message.error("Ошибка при создании заказа");
    }
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
        columns={[
          {
            title: "Клиент",
            dataIndex: "clientId",
            render: (clientId: string) =>
              clients.find((c) => c.id === clientId)?.name || "—",
          },
          {
            title: "Склад",
            dataIndex: "warehouseId",
            render: (warehouseId: string) =>
              warehouses.find((w) => w.id === warehouseId)?.name || "—",
          },
          {
            title: "Статус",
            dataIndex: "status",
          },
        ]}
      />

      <Modal
        title="Создать заказ"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
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
        </Form>
      </Modal>
    </div>
  );
}
