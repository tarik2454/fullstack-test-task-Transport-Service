"use client";

import { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Button from "antd/es/button";
import Input from "antd/es/input";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { role } = await res.json();
        message.success("Успешный вход");
        router.push(
          role === "MANAGER" ? "dashboard/manager/clients" : "dashboard/driver"
        );
      } else {
        const data = await res.json();
        message.error(data.error || "Ошибка входа");
      }
    } catch {
      message.error("Ошибка сервера");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Вход</h2>

      <Input
        placeholder="Email"
        className="mb-4"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <Input.Password
        placeholder="Пароль"
        className="mb-6"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <Button type="primary" className="w-full" onClick={handleSubmit}>
        Войти
      </Button>
    </div>
  );
}
