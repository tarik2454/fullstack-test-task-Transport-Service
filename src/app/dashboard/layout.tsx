"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <div className="flex gap-4">
          <Link href="/dashboard/manager/orders">Заказы</Link>
          <Link href="/dashboard/manager/warehouses">Склады</Link>
          <Link href="/dashboard/manager/clients">Клиенты</Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Выйти
        </button>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
