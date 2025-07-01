import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Delivery service</h1>
        <p>
          Please,
          <Link href="/login" className="text-blue-600 underline">
            login
          </Link>
          or
          <Link href="/register" className="text-blue-600 underline">
            register
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
