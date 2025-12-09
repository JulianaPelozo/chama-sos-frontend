const API_URL = "http://localhost:5000/api";

let usuariosCache = [];
let usuarioParaExcluir = null;

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function verificarAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return null;
    }
    return token;
}

async function carregarUsuarios() {
    const token = verificarAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/listalogins`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("token");
                window.location.href = "index.html";
                return;
            }
            throw new Error("Erro ao carregar usuários");
        }

        const data = await res.json();
        usuariosCache = Array.isArray(data) ? data : [];
        renderizarTabela(usuariosCache);

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("userTableBody").innerHTML = `
            <tr><td colspan="6" class="error-text">Erro ao carregar usuários. Verifique se o servidor está ativo.</td></tr>
        `;
    }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById("userTableBody");

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-text">Nenhum usuário encontrado</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(user => {
        const id = escapeHtml(user._id || "");
        const idCurto = id.slice(-6) || "—";
        const firstName = escapeHtml(user.firstName || "");
        const lastName = escapeHtml(user.lastName || "");
        const nome = escapeHtml(user.nome || "");
        const nomeCompleto = firstName ? `${firstName} ${lastName}` : nome;
        const email = escapeHtml(user.email || "—");
        const cpf = escapeHtml(user.CPF || user.cpf || "—");
        const role = user.role || "usuario";
        const nomeExibicao = firstName || nome || "Usuário";
        
        return `
            <tr>
                <td><code>${idCurto}</code></td>
                <td>${nomeCompleto || "—"}</td>
                <td>${email}</td>
                <td>${cpf}</td>
                <td><span class="role-badge role-${escapeHtml(role)}">${formatarRole(role)}</span></td>
                <td class="actions-cell">
                    <button class="btn-icon btn-edit" onclick="editarUsuario('${id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="abrirModalDelete('${id}', '${escapeHtml(nomeExibicao)}')" title="Excluir">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join("");
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
    const filtrados = usuariosCache.filter(u =>
        `${u.firstName || ""} ${u.lastName || ""} ${u.nome || ""} ${u.email || ""} ${u.CPF || u.cpf || ""}`.toLowerCase().includes(termo)
    );
    renderizarTabela(filtrados);
});

function abrirModalNovoUsuario() {
    document.getElementById("modalTitle").textContent = "Novo Usuário";
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    document.getElementById("senhaGroup").querySelector("small").style.display = "none";
    document.getElementById("senha").required = true;
    document.getElementById("modalError").textContent = "";
    document.getElementById("modalSuccess").textContent = "";
    document.getElementById("modalOverlay").classList.add("active");
}

function editarUsuario(id) {
    const user = usuariosCache.find(u => u._id === id);
    if (!user) return;

    document.getElementById("modalTitle").textContent = "Editar Usuário";
    document.getElementById("userId").value = user._id;
    document.getElementById("nome").value = user.nome || "";
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("cpf").value = user.CPF || user.cpf || "";
    document.getElementById("role").value = user.role || "usuario";
    document.getElementById("senha").value = "";
    document.getElementById("senhaGroup").querySelector("small").style.display = "inline";
    document.getElementById("senha").required = false;
    document.getElementById("modalError").textContent = "";
    document.getElementById("modalSuccess").textContent = "";
    document.getElementById("modalOverlay").classList.add("active");
}

function fecharModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = verificarAuth();
    if (!token) return;

    const userId = document.getElementById("userId").value;
    const isEdit = !!userId;

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
        role: document.getElementById("role").value,
    };

    const senha = document.getElementById("senha").value;
    if (senha) {
        dados.senha = senha;
    }

    const errorEl = document.getElementById("modalError");
    const successEl = document.getElementById("modalSuccess");
    errorEl.textContent = "";
    successEl.textContent = "";

    try {
        const url = isEdit ? `${API_URL}/usuarios/${userId}` : `${API_URL}/register`;
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(dados),
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.message || "Erro ao salvar usuário";
            return;
        }

        successEl.textContent = isEdit ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!";
        
        setTimeout(() => {
            fecharModal();
            carregarUsuarios();
        }, 1500);

    } catch (error) {
        console.error("Erro:", error);
        errorEl.textContent = "Erro ao conectar com o servidor";
    }
});

function abrirModalDelete(id, nome) {
    usuarioParaExcluir = id;
    document.getElementById("deleteUserName").textContent = nome;
    document.getElementById("deleteModalOverlay").classList.add("active");
}

function fecharModalDelete() {
    usuarioParaExcluir = null;
    document.getElementById("deleteModalOverlay").classList.remove("active");
}

async function confirmarExclusao() {
    if (!usuarioParaExcluir) return;

    const token = verificarAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/usuarios/${usuarioParaExcluir}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Erro ao excluir usuário");
            return;
        }

        fecharModalDelete();
        carregarUsuarios();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
});

document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModal();
});

document.getElementById("deleteModalOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModalDelete();
});

document.getElementById("cpf").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    e.target.value = value;
});

carregarUsuarios();
