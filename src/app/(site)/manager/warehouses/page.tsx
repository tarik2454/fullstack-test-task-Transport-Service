"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { handleFormErrors } from "@/utils/handleFormErrors";
import {
  deleteWarehouse,
  getWarehouses,
  saveWarehouse,
} from "@/utils/apiClient/warehouse";
import { Warehouse } from "@/schemas/warehouseSchemas";
import { FormLabel } from "@/components/FormLabel";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | undefined>(undefined);
  const [form] = Form.useForm();

  const fetchWarehouses = async () => {
    setLoading(true);

    const res = await getWarehouses();

    if (!res.success) {
      handleFormErrors(res.error);
      return;
    }

    setWarehouses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = editing ? { ...values, id: editing.id } : values;

    const res = await saveWarehouse(payload, editing);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success("Saved");
    fetchWarehouses();
    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteWarehouse(id);

    if (!res.success) {
      handleFormErrors(res.error);
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
          setEditing(undefined);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label={<FormLabel text="Name" required />}>
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label={<FormLabel text="Address" required />}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
