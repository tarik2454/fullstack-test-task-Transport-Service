"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const firstSegment = pathname.split("/")[1];

  const role =
    firstSegment === "manager"
      ? "MANAGER"
      : firstSegment === "driver"
      ? "DRIVER"
      : null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        {role === "MANAGER" && (
          <div className="flex gap-4">
            <Link href="/manager/orders">Заказы</Link>
            <Link href="/manager/warehouses">Склады</Link>
            <Link href="/manager/clients">Клиенты</Link>
          </div>
        )}

        {role === "DRIVER" && (
          <div className="flex gap-4">
            <Link href="/driver/orders">Мои заказы</Link>
          </div>
        )}

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
