"use client";

import {
  OrderCreate,
  orderCreateSchema,
  OrderData,
} from "@/schemas/commonOrderSchemas";
import { deleteOrder, saveOrder } from "@/utils/apiClient/order";
import { getValidationRules, handleServerErrors } from "@/utils/formValidation";
import { Button, Form, message, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { FormLabel } from "./FormLabel";
import { ClientData } from "@/schemas/clientSchemas";
import { WarehouseData } from "@/schemas/warehouseSchemas";
import { getClients } from "@/utils/apiClient/client";
import { getWarehouses } from "@/utils/apiClient/warehouse";
import { upsertToTop } from "@/utils/upsertToTop";

const statusOptions = [
  { label: "NEW", value: "NEW" },
  { label: "ASSIGNED", value: "ASSIGNED" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
];

export function ManagerOrdersTable({
  initialOrders,
}: {
  initialOrders: OrderData[];
}) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrderData | undefined>(undefined);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      const [clientsResult, warehousesResult] = await Promise.all([
        getClients(),
        getWarehouses(),
      ]);

      if (clientsResult.success) {
        setClients(clientsResult.data);
      } else {
        message.warning("Failed to load clients");
      }

      if (warehousesResult.success) {
        setWarehouses(warehousesResult.data);
      } else {
        message.warning("Failed to load warehouses");
      }
    }
    fetchData();
  }, []);

  const handleOpenModal = async (record?: OrderData) => {
    if (record) {
      form.setFieldsValue(record);
      setEditing(record);
    } else {
      setEditing(undefined);
    }

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);

    const values = form.getFieldsValue() as OrderCreate;

    const payload = {
      clientId: values.clientId,
      warehouseId: values.warehouseId,
      status: values.status,
    };

    const res = await saveOrder(payload, editing);

    if (!res.success) {
      handleServerErrors(res.error, form);
      return;
    }

    message.success(editing ? "Updated" : "Created");

    setOrders((prev) =>
      upsertToTop(prev, res.data, (order) => order.id === res.data.id)
    );

    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);

    const res = await deleteOrder(id);

    if (!res.success) {
      handleServerErrors(res.error, form);
      return;
    }

    message.success("Deleted");

    setOrders((prev) => prev.filter((o) => o.id !== id));

    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button onClick={() => handleOpenModal()}>Create</Button>
      </div>

      <Table
        rowKey="id"
        dataSource={orders}
        loading={loading}
        bordered
        columns={[
          {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_: unknown, __: OrderData, index: number) => index + 1,
            width: 50,
          },
          {
            title: "Client",
            dataIndex: ["client", "name"],
          },
          {
            title: "Warehouse",
            dataIndex: ["warehouse", "name"],
          },
          {
            title: "Manager",
            dataIndex: "manager",
            render: (manager: OrderData["manager"]) =>
              manager ? `${manager.firstName} ${manager.lastName}` : "—",
          },
          {
            title: "Driver",
            dataIndex: "driver",
            render: (driver?: OrderData["driver"]) =>
              driver ? `${driver.firstName} ${driver.lastName}` : "—",
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Actions",
            render: (_, record: OrderData) => (
              <div className="flex gap-2">
                <Button size="small" onClick={() => handleOpenModal(record)}>
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
        title={editing ? "Change order" : "Create order"}
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
            name="clientId"
            label={<FormLabel text="Client" required />}
            rules={getValidationRules(orderCreateSchema, "clientId")}
            validateTrigger="onChange"
          >
            <Select
              placeholder="Choose a client"
              options={clients.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="warehouseId"
            label={<FormLabel text="Warehouse" required />}
            rules={getValidationRules(orderCreateSchema, "warehouseId")}
            validateTrigger="onChange"
          >
            <Select
              placeholder="Choose a warehouse"
              options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={<FormLabel text="Status" required />}
            rules={getValidationRules(orderCreateSchema, "status")}
            validateTrigger="onChange"
            initialValue="NEW"
          >
            <Select placeholder="Choose a status" options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
