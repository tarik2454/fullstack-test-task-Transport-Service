"use client";

import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormLabel } from "@/components/FormLabel";
import { registerSchema } from "@/schemas/authSchemas";
import { handleErrors } from "@/utils/handleErrors";

const { Option } = Select;

import { ZodObject, ZodRawShape } from "zod";

function getRules<T extends ZodRawShape>(schema: ZodObject<T>, field: keyof T) {
  return [
    {
      validator: async (_: unknown, value: unknown) => {
        const result = schema.shape[field].safeParse(value);
        if (result.success) return Promise.resolve();
        return Promise.reject(new Error(result.error.errors[0].message));
      },
    },
  ];
}

export default function RegisterPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const { data, error } = await res.json();

    if (!res.ok) {
      handleErrors(error, form);
      return;
    }

    message.success(`Registration ${data.user.email} was successful`);
    router.push("/login");
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
          <Form.Item
            name="firstName"
            label={<FormLabel text="Name" required />}
            rules={getRules(registerSchema, "firstName")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<FormLabel text="Last name" required />}
            rules={getRules(registerSchema, "lastName")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={<FormLabel text="Email" required />}
            rules={getRules(registerSchema, "email")}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={<FormLabel text="Password" required />}
            rules={getRules(registerSchema, "password")}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label={<FormLabel text="Role" required />}
            rules={getRules(registerSchema, "role")}
          >
            <Select placeholder="Choose your role">
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
