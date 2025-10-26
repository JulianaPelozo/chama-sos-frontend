export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-20 md:w-64 bg-red-600 text-white p-4 flex flex-col">
        <h2 className="hidden md:block text-xl font-semibold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:text-gray-200">🏠 Início</a>
          <a href="#" className="hover:text-gray-200">👤 Usuários</a>
          <a href="#" className="hover:text-gray-200">⚙️ Configurações</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Bem-vindo!</h1>
        <p className="text-gray-500 mb-4">29 de outubro, 2025</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <h3 className="text-gray-700">Ocorrências abertas</h3>
            <p className="text-3xl font-bold text-red-600">24</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <h3 className="text-gray-700">Chamadas finalizadas</h3>
            <p className="text-3xl font-bold text-red-600">15</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <h3 className="text-gray-700">Usuários ativos</h3>
            <p className="text-3xl font-bold text-red-600">9</p>
          </div>
        </div>
      </main>
    </div>
  );
}
