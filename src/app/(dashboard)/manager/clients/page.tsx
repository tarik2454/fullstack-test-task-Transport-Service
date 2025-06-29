"use client";

import { Button, Form, Input, message, Modal, Table } from "antd";
import { useState, useEffect } from "react";

interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form] = Form.useForm();

  const fetchClients = async () => {
    setLoading(true);
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/clients/${editing.id}` : "/api/clients";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Сохранено");
      fetchClients();
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } else {
      message.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    message.success("Удалено");
    fetchClients();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Клиенты</h2>
        <Button onClick={() => setIsModalOpen(true)}>Добавить</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={clients}
        loading={loading}
        bordered
        columns={[
          {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_: unknown, __: Client, index: number) => index + 1,
            width: 50,
          },
          { title: "Имя", dataIndex: "name" },
          { title: "Адрес", dataIndex: "address" },
          { title: "Телефон", dataIndex: "phone" },
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
        title={editing ? "Изменить клиента" : "Добавить клиента"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Адрес" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
