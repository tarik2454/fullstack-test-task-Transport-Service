"use client";

import { Client, ClientCreate } from "@/schemas/clientSchemas";
import { getClients, saveClient } from "@/utils/apiClient/client";
import { handleFormErrors } from "@/utils/zod/handleFormErrors";
import { Button, Form, Input, message, Modal, Table } from "antd";
import { useState, useEffect } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientCreate | null>(null);
  const [form] = Form.useForm();

  const fetchClients = async () => {
    setLoading(true);

    const res = await getClients();

    if (!res.success) {
      handleFormErrors(res.error);
      return;
    }

    setClients(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const values = await form.validateFields();

    const res = await saveClient(values);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success("Successfully saved");
    fetchClients();
    setIsModalOpen(false);
    form.resetFields();
    setEditing(null);
    setLoading(true);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const { error } = await res.json();
      message.error(error);
      return;
    }

    message.success("Successfully deleted");
    fetchClients();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Clients</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add client</Button>
      </div>

      <Table
        dataSource={clients}
        rowKey="id"
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
          { title: "Name", dataIndex: "name" },
          { title: "Address", dataIndex: "address" },
          { title: "Phone", dataIndex: "phone" },
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
        title={editing ? "Change client" : "Add client"}
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
            name="name"
            label={
              <span className="flex items-center gap-[2px]">
                Name <span className="text-red-500">*</span>
              </span>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={
              <span className="flex items-center gap-[2px]">
                Address <span className="text-red-500">*</span>
              </span>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label={
              <span className="flex items-center gap-[2px]">
                Phone <span className="text-red-500">*</span>
              </span>
            }
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
