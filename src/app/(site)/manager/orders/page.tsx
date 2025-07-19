"use client";

import { useEffect, useState } from "react";
import { Table, Button, Select, Form, Modal, message } from "antd";
import { FormLabel } from "@/components/FormLabel";
import { deleteOrder, getOrders, saveOrder } from "@/utils/apiClient/order";
import { getClients } from "@/utils/apiClient/client";
import { getWarehouses } from "@/utils/apiClient/warehouse";
import { OrderCreate } from "@/schemas/commonOrderSchemas";
import { Order } from "@/schemas/commonOrderSchemas";
import { Client } from "@/schemas/clientSchemas";
import { Warehouse } from "@/schemas/warehouseSchemas";
import { handleFormErrors } from "@/utils/formValidation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
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
    const values = await form.validateFields();

    const payload: OrderCreate = {
      clientId: values.clientId,
      warehouseId: values.warehouseId,
      status: values.status,
    };

    const res = await saveOrder(payload, editing ?? undefined);

    if (!res.success) {
      handleFormErrors(res.error, form);
      return;
    }

    message.success(editing ? "Updated" : "Created");
    fetchAll();
    setIsModalOpen(false);
    form.resetFields();
    setEditing(null);
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
            render: (_: unknown, __: Order, index: number) => index + 1,
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
            render: (manager: Order["manager"]) =>
              `${manager.firstName} ${manager.lastName}`,
          },
          {
            title: "Driver",
            dataIndex: "driver",
            render: (driver?: Order["driver"]) =>
              driver ? `${driver.firstName} ${driver.lastName}` : "—",
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Actions",
            render: (_, record: Order) => (
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
          setEditing(null);
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="clientId"
            label={<FormLabel text="Client" required />}
          >
            <Select
              placeholder="Choose a client"
              options={clients.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item
            name="warehouseId"
            label={<FormLabel text="Warehouse" required />}
          >
            <Select
              placeholder="Choose a warehouse"
              options={warehouses.map((w) => ({ label: w.name, value: w.id }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label={<FormLabel text="Status" required />}
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
