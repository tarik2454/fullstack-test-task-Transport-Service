"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, message, Select } from "antd";
import Link from "next/link";
import { useEffect } from "react";
import { FormLabel } from "@/components/FormLabel";
import { LoginData, LoginResponse, loginSchema } from "@/schemas/authSchemas";
import { handleFormErrors, getValidationRules } from "@/utils/formValidation";
import { ApiResultServer } from "@/utils/apiClient/types";

const roleOptions = [
  { label: "Manager", value: "MANAGER" },
  { label: "Driver", value: "DRIVER" },
];

const defaultCredentials = {
  MANAGER: { email: "manager1@gmail.com", password: "123456" },
  DRIVER: { email: "driver1@gmail.com", password: "123456" },
};

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    form.setFieldsValue({
      role: "MANAGER",
      ...defaultCredentials["MANAGER"],
    });
  }, [form]);

  const onRoleChange = (role: string) => {
    form.setFieldsValue({
      email: defaultCredentials[role as keyof typeof defaultCredentials].email,
      password:
        defaultCredentials[role as keyof typeof defaultCredentials].password,
    });
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue() as LoginData & { role: string };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const { data, error }: ApiResultServer<LoginResponse> = await res.json();

    if (!res.ok || !data) {
      handleFormErrors(error, form);
      return;
    }

    message.success(`Welcome, ${data.user.email}!`);
    router.push(
      data.user.role === "MANAGER" ? "/manager/orders" : "/driver/orders"
    );
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
            name="role"
            label={<FormLabel text="Role" required={false} />}
            rules={[{ required: false, message: "Please select your role" }]}
          >
            <Select options={roleOptions} onChange={onRoleChange} />
          </Form.Item>

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
