"use client";

import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormLabel } from "@/components/FormLabel";
import { registerSchema } from "@/schemas/authSchemas";
// import { handleErrors } from "@/utils/handleErrors";

const { Option } = Select;

import { ZodTypeAny } from "zod";

export function getValidationRule(schema: ZodTypeAny) {
  return async (_: unknown, value: unknown) => {
    const result = schema.safeParse(value);
    if (result.success) {
      return Promise.resolve();
    }
    const firstError = result.error.errors[0];
    return Promise.reject(new Error(firstError.message));
  };
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

    if (!res.ok) {
      return;
    }

    message.success("Registration was successful");
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
            rules={[
              { validator: getValidationRule(registerSchema.shape.firstName) },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<FormLabel text="Last name" required />}
            rules={[
              { validator: getValidationRule(registerSchema.shape.lastName) },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={<FormLabel text="Email" required />}
            rules={[
              { validator: getValidationRule(registerSchema.shape.email) },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={<FormLabel text="Password" required />}
            rules={[
              { validator: getValidationRule(registerSchema.shape.password) },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label={<FormLabel text="Role" required />}
            rules={[
              { validator: getValidationRule(registerSchema.shape.role) },
            ]}
          >
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
