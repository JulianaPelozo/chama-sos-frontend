const API_URL = "http://localhost:3000/ocorrencias";

async function carregarOcorrencias() {
    const tbody = document.getElementById("occurrenceTableBody");
    tbody.innerHTML = `<tr><td colspan="6" class="loading-text">Carregando...</td></tr>`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        atualizarContadores(data);
        renderizarTabela(data);

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="loading-text error">Erro ao carregar dados</td></tr>`;
    }
}

function atualizarContadores(lista) {
    document.getElementById("countAll").textContent = lista.length;
    document.getElementById("countPending").textContent = lista.filter(o => o.status === "pendente").length;
    document.getElementById("countProgress").textContent = lista.filter(o => o.status === "em_andamento").length;
    document.getElementById("countResolved").textContent = lista.filter(o => o.status === "resolvida").length;
}

function renderizarTabela(lista) {
    const tbody = document.getElementById("occurrenceTableBody");
    tbody.innerHTML = "";

    lista.forEach(o => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.titulo}</td>
            <td>${o.localizacao}</td>
            <td>${o.status}</td>
            <td>${new Date(o.data).toLocaleString()}</td>
            <td>
                <button class="btn-secondary" onclick="abrirModal(${o.id})">Editar</button>
                <button class="btn-danger" onclick="abrirModalDelete(${o.id}, '${o.titulo}')">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


async function abrirModal(id) {
    document.getElementById("modalOverlay").style.display = "flex";

    const response = await fetch(`${API_URL}/${id}`);
    const dados = await response.json();

    document.getElementById("occurrenceId").value = dados.id;
    document.getElementById("titulo").value = dados.titulo;
    document.getElementById("descricao").value = dados.descricao;
    document.getElementById("localizacao").value = dados.localizacao;
    document.getElementById("status").value = dados.status;
    document.getElementById("prioridade").value = dados.prioridade;
    document.getElementById("observacoes").value = dados.observacoes || "";
}

function fecharModal() {
    document.getElementById("modalOverlay").style.display = "none";
}

async function salvarOcorrencia(event) {
    event.preventDefault();

    const id = document.getElementById("occurrenceId").value;

    const ocorrencia = {
        titulo: titulo.value,
        descricao: descricao.value,
        localizacao: localizacao.value,
        status: status.value,
        prioridade: prioridade.value,
        observacoes: observacoes.value
    };

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ocorrencia)
    });

    fecharModal();
    carregarOcorrencias();
}


let idParaExcluir = null;

function abrirModalDelete(id, titulo) {
    idParaExcluir = id;
    document.getElementById("deleteOccurrenceName").textContent = titulo;
    document.getElementById("deleteModalOverlay").style.display = "flex";
}

function fecharModalDelete() {
    document.getElementById("deleteModalOverlay").style.display = "none";
}

async function confirmarExclusao() {
    await fetch(`${API_URL}/${idParaExcluir}`, { method: "DELETE" });
    fecharModalDelete();
    carregarOcorrencias();
}

document.getElementById("occurrenceForm").addEventListener("submit", salvarOcorrencia);

carregarOcorrencias();
