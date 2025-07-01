"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { handleServerErrors } from "@/utils/handleFormErrors";

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

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    const data = await res.json();
    setWarehouses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/warehouses/${editing.id}` : "/api/warehouses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        handleServerErrors(error, form);
        return;
      }

      message.success("Successfully saved");
      fetchWarehouses();
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    message.success("Deleted");
    fetchWarehouses();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Warehouses</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add warehouse</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={warehouses}
        loading={loading}
        bordered
        columns={[
          {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_: unknown, __: Warehouse, index: number) => index + 1,
            width: 50,
          },
          { title: "Name", dataIndex: "name" },
          { title: "Address", dataIndex: "address" },
          {
            title: "Actions",
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
        title={editing ? "Change warehouses" : "Add warehouses"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
