"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { deleteWarehouse, saveWarehouse } from "@/utils/apiClient/warehouse";
import {
  WarehouseData,
  warehouseCreateSchema,
} from "@/schemas/warehouseSchemas";
import { FormLabel } from "@/components/FormLabel";
import { getValidationRules, handleServerErrors } from "@/utils/formValidation";
import { upsertToTop } from "@/utils/upsertToTop";

export function ManagerWarehousesTable({
  initialWarehouses,
}: {
  initialWarehouses: WarehouseData[];
}) {
  const [warehouses, setWarehouses] =
    useState<WarehouseData[]>(initialWarehouses);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<WarehouseData | undefined>(undefined);
  const [form] = Form.useForm();

  const handleSave = async () => {
    setLoading(true);

    const values = form.getFieldsValue() as WarehouseData;
    const payload = editing ? { ...values, id: editing.id } : values;

    const res = await saveWarehouse(payload, editing);

    if (!res.success) {
      handleServerErrors(res.error, form);
      return;
    }

    message.success("Saved");

    setWarehouses((prev) =>
      upsertToTop(prev, res.data, (w) => w.id === res.data.id)
    );

    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteWarehouse(id);

    if (!res.success) {
      handleServerErrors(res.error);
      return;
    }

    message.success("Deleted");

    setWarehouses((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <>
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
            render: (_: unknown, __: WarehouseData, index: number) => index + 1,
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
        title={editing ? "Change warehouse" : "Add warehouse"}
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
            rules={getValidationRules(warehouseCreateSchema, "name")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label={<FormLabel text="Address" required />}
            rules={getValidationRules(warehouseCreateSchema, "address")}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
