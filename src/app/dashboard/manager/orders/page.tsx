"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";

interface Order {
  id: string;
  warehouseId: string;
  clientId: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  interface Client {
    id: string;
    name: string;
  }

  interface Warehouse {
    id: string;
    name: string;
  }

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

      // Проверка ответов
      if (!ordersRes.ok) {
        const text = await ordersRes.text();
        console.error("Ошибка /api/orders:", ordersRes.status, text);
        setLoading(false);
        return;
      }
      if (!clientsRes.ok) {
        const text = await clientsRes.text();
        console.error("Ошибка /api/clients:", clientsRes.status, text);
        setLoading(false);
        return;
      }
      if (!warehousesRes.ok) {
        const text = await warehousesRes.text();
        console.error("Ошибка /api/warehouses:", warehousesRes.status, text);
        setLoading(false);
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
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Заказы</h2>
        <Button onClick={() => setIsModalOpen(true)}>Создать</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={orders}
        loading={loading}
        columns={[
          { title: "Клиент", dataIndex: "clientId" },
          { title: "Склад", dataIndex: "warehouseId" },
          { title: "Статус", dataIndex: "status" },
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
            rules={[{ required: true }]}
          >
            {" "}
            <Select
              options={clients.map((c) => ({ label: c.name, value: c.id }))}
            />{" "}
          </Form.Item>
          <Form.Item
            name="warehouseId"
            label="Склад"
            rules={[{ required: true }]}
          >
            {" "}
            <Select
              options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
            />{" "}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
