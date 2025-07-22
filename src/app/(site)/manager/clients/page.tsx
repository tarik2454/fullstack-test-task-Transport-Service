"use client";

import { FormLabel } from "@/components/FormLabel";
import { clientCreateSchema, ClientData } from "@/schemas/clientSchemas";
import { deleteClient, getClients, saveClient } from "@/utils/apiClient/client";
import { getValidationRules, handleFormErrors } from "@/utils/formValidation";
import { Button, Form, Input, message, Modal, Table } from "antd";
import { useState, useEffect } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientData | undefined>(undefined);
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
    const values = form.getFieldsValue() as ClientData;

    const payload = editing ? { ...values, id: editing.id } : values;

    const res = await saveClient(payload, editing);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success("Saved");
    fetchClients();
    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteClient(id);

    if (!res.success) {
      handleFormErrors(res.error);
      return;
    }

    message.success("Deleted");
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
            render: (_: unknown, __: ClientData, index: number) => index + 1,
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
          setEditing(undefined);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label={<FormLabel text="Name" required />}
            rules={getValidationRules(clientCreateSchema, "name")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={<FormLabel text="Address" required />}
            rules={getValidationRules(clientCreateSchema, "address")}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<FormLabel text="Phone" required />}
            rules={getValidationRules(clientCreateSchema, "phone")}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
