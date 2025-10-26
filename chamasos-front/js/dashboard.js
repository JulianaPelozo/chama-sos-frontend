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
            headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        const data = await res.json();
        usuariosCache = data; 
        preencherTabela(data);
    } catch (err) {
        console.error("Erro ao buscar dados:", err);
    }
}

function preencherTabela(usuarios) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    usuarios.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nome || "—"}</td>
      <td>${user.email || "—"}</td>
    `;
        tbody.appendChild(tr);
    });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();

    const filtrados = usuariosCache.filter((u) =>
        `${u.nome} ${u.email}`.toLowerCase().includes(termo)
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

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
});

verificarToken();
