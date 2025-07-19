"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import Link from "next/link";
import { FormLabel } from "@/components/FormLabel";
import { loginSchema } from "@/schemas/authSchemas";
import { handleFormErrors, getValidationRules } from "@/utils/formValidation";

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const { data, error } = await res.json();

    if (!res.ok) {
      handleFormErrors(error, form);
      return;
    }

    const { role } = await res.json();
    message.success(`Welcome, ${data.user.email}!`);
    router.push(role === "MANAGER" ? "/manager/orders" : "/driver/orders");
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
            label={<FormLabel text="Email" />}
            rules={getValidationRules(loginSchema, "email")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={<FormLabel text="Password" />}
            rules={getValidationRules(loginSchema, "password")}
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
