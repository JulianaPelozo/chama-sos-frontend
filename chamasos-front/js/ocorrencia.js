const API_URL = "http://localhost:5000/api/ocorrencias";

document.getElementById("ocorrenciaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();
  const token = localStorage.getItem("token");
  const mensagemEl = document.getElementById("mensagem");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/novaocorrencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ titulo, descricao, localizacao }),
    });

    const data = await res.json();

    if (res.ok) {
      mensagemEl.textContent = "✅ Ocorrência registrada com sucesso!";
      mensagemEl.style.color = "green";
      e.target.reset();
    } else {
      mensagemEl.textContent = `❌ ${data.message || "Erro ao registrar ocorrência."}`;
      mensagemEl.style.color = "red";
    }
  } catch (err) {
    console.error("Erro:", err);
    mensagemEl.textContent = "❌ Erro de conexão com o servidor.";
    mensagemEl.style.color = "red";
  }
});

document.getElementById("voltarDashboard").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});