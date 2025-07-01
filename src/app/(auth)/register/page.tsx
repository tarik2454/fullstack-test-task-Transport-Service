"use client";

import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { handleServerErrors } from "@/utils/handleFormErrors";

const { Option } = Select;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        handleServerErrors(data.error, form);
        return;
      }

      message.success("Регистрация прошла успешно");
      router.push("/login");
    } catch (err) {
      console.warn("Ошибка:", err);
      message.error("Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registration</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="firstName" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select placeholder="Сhoose your role">
            <Option value="MANAGER">Manager</Option>
            <Option value="DRIVER">Driver</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full mt-4">
          Register
        </Button>
      </Form>
    </div>
  );
}
