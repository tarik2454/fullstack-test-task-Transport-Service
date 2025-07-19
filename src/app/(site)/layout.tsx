"use client";

import { handleFormErrors } from "@/utils/formValidation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type UserPayload = {
  id: string;
  role: "MANAGER" | "DRIVER";
  email: string;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/current");

      const data = await res.json();

      if (!res.ok) {
        handleFormErrors(data.error);
        return;
      }

      setUser(data.user);
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        {user?.role === "MANAGER" && (
          <div className="flex gap-4">
            <Link
              href="/manager/orders"
              className="hover:text-blue-500 transition "
            >
              Orders
            </Link>
            <Link
              href="/manager/warehouses"
              className="hover:text-blue-500 transition "
            >
              Warehouses
            </Link>
            <Link
              href="/manager/clients"
              className="hover:text-blue-500 transition "
            >
              Clients
            </Link>
          </div>
        )}

        {user?.role === "DRIVER" && (
          <div className="flex gap-4">
            <Link
              href="/driver/orders"
              className="hover:text-blue-500 transition "
            >
              My Orders
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <p>{user?.email}</p>
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
