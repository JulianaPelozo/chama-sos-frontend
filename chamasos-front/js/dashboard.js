const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Se o usuário não estiver logado, redireciona
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  carregarUsuarios(token);
});

async function carregarUsuarios(token) {
  try {
    const response = await fetch(`${API_URL}/listalogins`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      window.location.href = "index.html";
      return;
    }

    // Exibe os dados na tabela
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    data.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user._id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
