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
            <Link
              href="/manager/orders"
              className="hover:text-blue-500 transition "
            >
              Orders
            </Link>
            <Link href="/manager/warehouses">Warehouses</Link>
            <Link href="/manager/clients">Clients</Link>
          </div>
        )}

        {role === "DRIVER" && (
          <div className="flex gap-4">
            <Link href="/driver/orders">My Orders</Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <p>{firstSegment}</p>
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Log out
          </button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
