"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";
import { FormLabel } from "@/components/FormLabel";
import { deleteOrder, getOrders, saveOrder } from "@/utils/apiClient/order";
import { getClients } from "@/utils/apiClient/client";
import { getWarehouses } from "@/utils/apiClient/warehouse";
import { OrderCreate, orderCreateSchema } from "@/schemas/commonOrderSchemas";
import { OrderData } from "@/schemas/commonOrderSchemas";
import { ClientData } from "@/schemas/clientSchemas";
import { WarehouseData } from "@/schemas/warehouseSchemas";
import { getValidationRules, handleFormErrors } from "@/utils/formValidation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrderData | undefined>(undefined);
  const [form] = Form.useForm();

  const fetchAll = async () => {
    setLoading(true);

    const [ordersResult, clientsResult, warehousesResult] = await Promise.all([
      getOrders(),
      getClients(),
      getWarehouses(),
    ]);

    if (ordersResult.success) {
      setOrders(
        ordersResult.data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );
    } else {
      message.warning("Failed to load orders");
    }

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

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSave = async () => {
    const values = form.getFieldsValue() as OrderCreate;

    const payload = {
      clientId: values.clientId,
      warehouseId: values.warehouseId,
      status: values.status,
    };

    const res = await saveOrder(payload, editing);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success(editing ? "Updated" : "Created");
    fetchAll();
    setIsModalOpen(false);
    form.resetFields();
    setEditing(undefined);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteOrder(id);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success("Deleted");
    fetchAll();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create
        </Button>
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
              `${manager.firstName} ${manager.lastName}`,
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
            <Select
              placeholder="Choose a status"
              options={[
                { label: "NEW", value: "NEW" },
                { label: "IN_PROGRESS", value: "IN_PROGRESS" },
                { label: "COMPLETED", value: "COMPLETED" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
