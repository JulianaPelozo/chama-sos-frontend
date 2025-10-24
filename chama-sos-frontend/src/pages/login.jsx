import React from "react";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-20" />
        <input
          type="text"
          placeholder="Login"
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          className="block w-full mb-4 p-2 border rounded"
        />
        <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
          Entrar
        </button>
      </div>
    </div>
  );
}
