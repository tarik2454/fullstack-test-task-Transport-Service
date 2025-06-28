import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <div className="flex gap-4">
          <Link href="/dashboard/manager">Менеджер</Link>
          <Link href="/dashboard/driver">Водитель</Link>
        </div>
        <Link href="/login">Выйти</Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
