const API_URL = "http://localhost:5000/api";

let usuariosCache = [];

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

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
        usuariosCache = Array.isArray(data) ? data : [];
        preencherTabela(usuariosCache);
    } catch (err) {
        console.error("Erro ao buscar dados:", err);
        const tbody = document.querySelector("#userTable tbody");
        tbody.innerHTML = `<tr><td colspan="5" class="error-text">Erro ao carregar usuários. Verifique o servidor.</td></tr>`;
    }
}

function preencherTabela(usuarios) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    if (!usuarios || !usuarios.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-text">Nenhum usuário encontrado.</td></tr>`;
        return;
    }

    usuarios.forEach((user) => {
        const tr = document.createElement("tr");
        const id = escapeHtml(user._id || "—");
        const idCurto = id.length > 6 ? id.slice(-6) : id;
        const firstName = escapeHtml(user.firstName || "");
        const lastName = escapeHtml(user.lastName || "");
        const nome = escapeHtml(user.nome || "");
        const nomeCompleto = firstName ? `${firstName} ${lastName}` : nome;
        const email = escapeHtml(user.email || "—");
        const cpf = escapeHtml(user.CPF || user.cpf || "—");
        const role = user.role || "usuario";
        
        tr.innerHTML = `
            <td><code>${idCurto}</code></td>
            <td>${nomeCompleto || "—"}</td>
            <td>${email}</td>
            <td>${cpf}</td>
            <td><span class="role-badge role-${escapeHtml(role)}">${formatarRole(role)}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function formatarRole(role) {
    const roles = {
        admin: "Administrador",
        operador: "Operador",
        usuario: "Usuário"
    };
    return roles[role] || "Usuário";
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();

    const filtrados = usuariosCache.filter((u) =>
        `${u.firstName || ""} ${u.lastName || ""} ${u.nome || ""} ${u.email || ""}`.toLowerCase().includes(termo)
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
