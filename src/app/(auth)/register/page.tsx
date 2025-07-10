"use client";

import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { handleFormErrors } from "@/utils/handleFormErrors";
import Link from "next/link";

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
        handleFormErrors(data.error, form);
        return;
      }

      message.success("Registration was successful");
      router.push("/login");
    } catch {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto p-6 border rounded-xl shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Registration
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-[380px] mb-2"
        >
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

          <Button type="primary" htmlType="submit" className="w-full mt-3">
            Register
          </Button>
        </Form>

        <p className="mt-3 text-center text-sm text-gray-600">
          Return to&nbsp;
          <Link href="/" className="text-blue-600 hover:underline">
            main page
          </Link>
        </p>
      </div>
    </div>
  );
}
