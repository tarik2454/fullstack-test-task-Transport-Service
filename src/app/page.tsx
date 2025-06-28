export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Сервис доставки</h1>
        <p>
          Пожалуйста,
          <a href="/login" className="text-blue-600 underline">
            войдите
          </a>
          или
          <a href="/register" className="text-blue-600 underline">
            зарегистрируйтесь
          </a>
          .
        </p>
      </div>
    </main>
  );
}
