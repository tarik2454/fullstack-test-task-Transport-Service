"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";

interface Warehouse {
  id: string;
  name: string;
  address: string;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const fetchWarehouses = async () => {
    setLoading(true);
    const res = await fetch("/api/warehouses");
    const data = await res.json();
    setWarehouses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/warehouses/${editing.id}` : "/api/warehouses";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Сохранено");
      fetchWarehouses();
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } else {
      message.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });
    if (res.ok) {
      message.success("Удалено");
      fetchWarehouses();
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Склады</h2>
        <Button onClick={() => setIsModalOpen(true)}>Добавить</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={warehouses}
        loading={loading}
        columns={[
          { title: "Название", dataIndex: "name" },
          { title: "Адрес", dataIndex: "address" },
          {
            title: "Действия",
            render: (_, record) => (
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
        title={editing ? "Изменить склад" : "Добавить склад"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="address" label="Адрес" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
