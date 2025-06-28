"use client";

import React, { useState } from "react";
import { Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";

const { Option } = Select;

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MANAGER",
  });
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return message.error(data.error || "Ошибка регистрации");

      message.success("Регистрация прошла успешно");
      router.push("/login");
    } catch (err) {
      console.error("Ошибка:", err);
      message.error("Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Регистрация</h2>

      <Input
        placeholder="Имя"
        className="mb-4"
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />
      <Input
        placeholder="Фамилия"
        className="mb-4"
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />
      <Input
        placeholder="Email"
        className="mb-4"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <Input.Password
        placeholder="Пароль"
        className="mb-4"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <Select
        className="mb-6 w-full"
        value={form.role}
        onChange={(value) => handleChange("role", value)}
      >
        <Option value="MANAGER">Менеджер</Option>
        <Option value="DRIVER">Водитель</Option>
      </Select>

      <Button type="primary" className="w-full" onClick={handleSubmit}>
        Зарегистрироваться
      </Button>
    </div>
  );
}
