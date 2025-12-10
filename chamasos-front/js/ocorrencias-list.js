const API_URL = "http://127.0.0.1:3000/ocorrencias";

const tabela = document.getElementById("tabelaOcorrencias");
const searchInput = document.getElementById("searchInput");
const filterPrioridade = document.getElementById("filterPrioridade");
const filterStatus = document.getElementById("filterStatus");

let ocorrencias = [];
let idEdicao = null;


async function carregarOcorrencias() {
    const resposta = await fetch(API_URL);
    ocorrencias = await resposta.json();
    renderTabela();
}

function renderTabela() {
    const busca = searchInput.value.toLowerCase();
    const prioridade = filterPrioridade.value;
    const status = filterStatus.value;

    tabela.innerHTML = "";

    ocorrencias
        .filter(o =>
            o.titulo.toLowerCase().includes(busca) ||
            o.descricao?.toLowerCase().includes(busca)
        )
        .filter(o => (prioridade ? o.prioridade === prioridade : true))
        .filter(o => (status ? o.status === status : true))
        .forEach(o => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${o.titulo}</td>
                <td>${o.localizacao}</td>
                <td>${o.prioridade}</td>
                <td>${o.status}</td>
                <td>${new Date(o.data).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editar(${o.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="excluir(${o.id})">Excluir</button>
                </td>
            `;

            tabela.appendChild(tr);
        });
}


function editar(id) {
    const ocorrencia = ocorrencias.find(o => o.id === id);
    idEdicao = id;

    document.getElementById("editTitulo").value = ocorrencia.titulo;
    document.getElementById("editDescricao").value = ocorrencia.descricao;
    document.getElementById("editLocalizacao").value = ocorrencia.localizacao;
    document.getElementById("editPrioridade").value = ocorrencia.prioridade;
    document.getElementById("editTipo").value = ocorrencia.tipo;
    document.getElementById("editObservacoes").value = ocorrencia.observacoes ?? "";

    document.getElementById("editPanel").classList.add("open");
}


document.getElementById("editForm").addEventListener("submit", async e => {
    e.preventDefault();

    const dados = {
        titulo: editTitulo.value,
        descricao: editDescricao.value,
        localizacao: editLocalizacao.value,
        prioridade: editPrioridade.value,
        tipo: editTipo.value,
        observacoes: editObservacoes.value,
    };

    await fetch(`${API_URL}/${idEdicao}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    fecharPainel();
    carregarOcorrencias();
});


async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    carregarOcorrencias();
}


function fecharPainel() {
    document.getElementById("editPanel").classList.remove("open");
}

searchInput.addEventListener("input", renderTabela);
filterPrioridade.addEventListener("change", renderTabela);
filterStatus.addEventListener("change", renderTabela);


carregarOcorrencias();
