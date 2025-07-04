"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { handleFormErrors } from "@/utils/zod/handleFormErrors";
import Link from "next/link";

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        handleFormErrors(error, form);
        return;
      }

      const { role } = await res.json();
      message.success("Successful entry");
      router.push(role === "MANAGER" ? "/manager/orders" : "/driver/orders");
    } catch {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto p-6 border rounded-xl shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-center">Enter</h2>

        <Form
          className="w-[380px]"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
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

          <Button type="primary" htmlType="submit" className="w-full mt-3">
            Login
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
