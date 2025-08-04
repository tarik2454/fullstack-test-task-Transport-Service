"use client";

import { FormLabel } from "@/components/FormLabel";
import { clientCreateSchema, ClientData } from "@/schemas/clientSchemas";
import { deleteClient, saveClient } from "@/utils/apiClient/client";
import { getValidationRules, handleServerErrors } from "@/utils/formValidation";
import { upsertToTop } from "@/utils/upsertToTop";
import { Button, Form, Input, message, Modal, Table } from "antd";
import { useState } from "react";

export function ManagerClientsTable({
  initialClients,
}: {
  initialClients: ClientData[];
}) {
  const [clients, setClients] = useState<ClientData[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ClientData | undefined>(undefined);
  const [form] = Form.useForm();

  const handleSave = async () => {
    setLoading(true);

    const values = form.getFieldsValue() as ClientData;
    const payload = editing ? { ...values, id: editing.id } : values;

    const res = await saveClient(payload, editing);

    if (!res.success) {
      handleServerErrors(res.error, form);
      return;
    }

    message.success("Saved");

    setClients((prev) =>
      upsertToTop(prev, res.data, (c) => c.id === res.data.id)
    );

    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteClient(id);

    if (!res.success) {
      handleServerErrors(res.error);
      return;
    }

    message.success("Deleted");

    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold ">Clients</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add client</Button>
      </div>

      <Table
        dataSource={clients}
        loading={loading}
        rowKey="id"
        bordered
        columns={[
          {
            title: "#",
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
