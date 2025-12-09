const API_URL = "http://localhost:5000/api";

let ocorrenciasCache = [];
let ocorrenciaParaExcluir = null;

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

async function carregarOcorrencias() {
    const token = verificarAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/ocorrencias`, {
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
            throw new Error("Erro ao carregar ocorrências");
        }

        const data = await res.json();
        ocorrenciasCache = Array.isArray(data) ? data : [];
        atualizarContadores(ocorrenciasCache);
        renderizarTabela(ocorrenciasCache);

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("occurrenceTableBody").innerHTML = `
            <tr><td colspan="6" class="error-text">Erro ao carregar ocorrências. Verifique se o servidor está ativo.</td></tr>
        `;
        atualizarContadores([]);
    }
}

function atualizarContadores(ocorrencias) {
    const total = ocorrencias.length;
    const pendentes = ocorrencias.filter(o => o.status === "pendente" || !o.status).length;
    const emAndamento = ocorrencias.filter(o => o.status === "em_andamento").length;
    const resolvidas = ocorrencias.filter(o => o.status === "resolvida").length;

    document.getElementById("countAll").textContent = total;
    document.getElementById("countPending").textContent = pendentes;
    document.getElementById("countProgress").textContent = emAndamento;
    document.getElementById("countResolved").textContent = resolvidas;
}

function renderizarTabela(ocorrencias) {
    const tbody = document.getElementById("occurrenceTableBody");

    if (!ocorrencias || ocorrencias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-text">Nenhuma ocorrência encontrada</td></tr>`;
        return;
    }

    tbody.innerHTML = ocorrencias.map(oc => {
        const id = escapeHtml(oc._id || "");
        const idCurto = id.slice(-6) || "—";
        const titulo = escapeHtml(oc.titulo || "—");
        const localizacao = escapeHtml(oc.localizacao || "—");
        const status = oc.status || "pendente";
        const prioridade = oc.prioridade || "";
        
        const statusClass = status === "resolvida" ? "status-resolved" :
            status === "em_andamento" ? "status-progress" : "status-pending";
        const statusText = status === "resolvida" ? "✅ Resolvida" :
            status === "em_andamento" ? "🔄 Em Andamento" : "⏳ Pendente";

        const data = oc.createdAt ? new Date(oc.createdAt).toLocaleDateString('pt-BR') : "—";
        
        let priorityBadge = "";
        if (prioridade === "urgente") {
            priorityBadge = '<span class="priority-badge priority-urgent">URGENTE</span>';
        } else if (prioridade === "alta") {
            priorityBadge = '<span class="priority-badge priority-high">ALTA</span>';
        }

        return `
            <tr class="occurrence-row ${statusClass}">
                <td><code>${idCurto}</code></td>
                <td class="title-cell">
                    <strong>${titulo}</strong>
                    ${priorityBadge}
                </td>
                <td>${localizacao}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${data}</td>
                <td class="actions-cell">
                    <button class="btn-icon btn-view" onclick="visualizarOcorrencia('${id}')" title="Visualizar/Editar">
                        👁️
                    </button>
                    <button class="btn-icon btn-edit" onclick="editarOcorrencia('${id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="abrirModalDelete('${id}', '${titulo.replace(/'/g, "\\'")}')" title="Excluir">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function filtrarOcorrencias() {
    const termo = document.getElementById("searchInput").value.toLowerCase();
    const statusFiltro = document.getElementById("filterStatus").value;

    let filtradas = ocorrenciasCache;

    if (termo) {
        filtradas = filtradas.filter(oc =>
            `${oc.titulo || ""} ${oc.descricao || ""} ${oc.localizacao || ""}`.toLowerCase().includes(termo)
        );
    }

    if (statusFiltro) {
        filtradas = filtradas.filter(oc => (oc.status || "pendente") === statusFiltro);
    }

    renderizarTabela(filtradas);
}

document.getElementById("searchInput").addEventListener("input", filtrarOcorrencias);
document.getElementById("filterStatus").addEventListener("change", filtrarOcorrencias);

function visualizarOcorrencia(id) {
    editarOcorrencia(id);
}

function editarOcorrencia(id) {
    const oc = ocorrenciasCache.find(o => o._id === id);
    if (!oc) return;

    document.getElementById("modalTitle").textContent = "Editar Ocorrência";
    document.getElementById("occurrenceId").value = oc._id;
    document.getElementById("titulo").value = oc.titulo || "";
    document.getElementById("descricao").value = oc.descricao || "";
    document.getElementById("localizacao").value = oc.localizacao || "";
    document.getElementById("status").value = oc.status || "pendente";
    document.getElementById("prioridade").value = oc.prioridade || "media";
    document.getElementById("observacoes").value = oc.observacoes || "";
    document.getElementById("modalError").textContent = "";
    document.getElementById("modalSuccess").textContent = "";
    document.getElementById("modalOverlay").classList.add("active");
}

function fecharModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

document.getElementById("occurrenceForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = verificarAuth();
    if (!token) return;

    const occurrenceId = document.getElementById("occurrenceId").value;

    const dados = {
        titulo: document.getElementById("titulo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        localizacao: document.getElementById("localizacao").value.trim(),
        status: document.getElementById("status").value,
        prioridade: document.getElementById("prioridade").value,
        observacoes: document.getElementById("observacoes").value.trim(),
    };

    const errorEl = document.getElementById("modalError");
    const successEl = document.getElementById("modalSuccess");
    errorEl.textContent = "";
    successEl.textContent = "";

    try {
        const res = await fetch(`${API_URL}/ocorrencias/${occurrenceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(dados),
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.message || "Erro ao salvar ocorrência";
            return;
        }

        successEl.textContent = "Ocorrência atualizada com sucesso!";

        setTimeout(() => {
            fecharModal();
            carregarOcorrencias();
        }, 1500);

    } catch (error) {
        console.error("Erro:", error);
        errorEl.textContent = "Erro ao conectar com o servidor";
    }
});

function abrirModalDelete(id, titulo) {
    ocorrenciaParaExcluir = id;
    document.getElementById("deleteOccurrenceName").textContent = titulo;
    document.getElementById("deleteModalOverlay").classList.add("active");
}

function fecharModalDelete() {
    ocorrenciaParaExcluir = null;
    document.getElementById("deleteModalOverlay").classList.remove("active");
}

async function confirmarExclusao() {
    if (!ocorrenciaParaExcluir) return;

    const token = verificarAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/ocorrencias/${ocorrenciaParaExcluir}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Erro ao excluir ocorrência");
            return;
        }

        fecharModalDelete();
        carregarOcorrencias();

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

carregarOcorrencias();
