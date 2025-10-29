const API_URL = "http://localhost:5000/api";

let usuariosCache = [];

async function verificarToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/listalogins`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      console.warn("Token inválido ou expirado.");
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return;
    }

    const data = await res.json();
    usuariosCache = data;
    preencherTabela(data);
  } catch (err) {
    console.error("❌ Erro ao buscar dados:", err);
    alert("Erro ao carregar usuários. Verifique o servidor.");
  }
}

function preencherTabela(usuarios) {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  if (!usuarios.length) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>`;
    return;
  }

  usuarios.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user._id || "—"}</td>
      <td>${user.firstName || ""} ${user.lastName || ""}</td>
      <td>${user.email || "—"}</td>
      <td>${user.CPF || "—"}</td>
      <td>${user.role || "—"}</td>
    `;
    tbody.appendChild(tr);
  });
}


document.getElementById("searchInput").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();

  const filtrados = usuariosCache.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(termo)
  );

  preencherTabela(filtrados);
});


function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}


document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
});


verificarToken();
