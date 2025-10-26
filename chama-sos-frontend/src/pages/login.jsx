import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login enviado:", { email, senha });
    alert(`Login enviado!\nEmail: ${email}\nSenha: ${senha}`);
  };

  return (
    <div className="w-[1333px] h-[750px] relative bg-[radial-gradient(ellipse_105.40%_105.40%_at_50.04%_-5.40%,_#E62F2F_0%,_#FF6161_100%)] overflow-hidden flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-[400px] flex flex-col items-center"
      >
        <img
          className="w-40 h-40 rounded-[30px] mb-6"
          src="https://placehold.co/160x160"
          alt="Logo"
        />

        <label className="text-white text-sm mb-1 self-start">Login</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          className="w-full mb-4 p-2 rounded-[10px] bg-zinc-200 text-black placeholder:text-gray-600 focus:outline-none"
          required
        />

        <label className="text-white text-sm mb-1 self-start">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          className="w-full mb-6 p-2 rounded-[10px] bg-zinc-200 text-black placeholder:text-gray-600 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-32 py-2 bg-zinc-300 rounded-[10px] text-black font-medium hover:bg-zinc-400 transition"
        >
          Entrar
        </button>

        <div className="text-center mt-4 text-xs">
          <p className="text-white">
            Esqueceu a senha? Clique{" "}
            <span className="text-indigo-300 cursor-pointer hover:underline">
              aqui
            </span>
          </p>
          <p className="text-white mt-1">
            Não tem cadastro? Clique{" "}
            <span className="text-indigo-300 cursor-pointer hover:underline">
              aqui
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
