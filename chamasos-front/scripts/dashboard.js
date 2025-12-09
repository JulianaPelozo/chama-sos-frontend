import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});

async function loadDashboard() {
    try {
        const ocorrencias = await apiRequest("/ocorrencias");

        updateCards(ocorrencias);
        updateRecentList(ocorrencias);
        createDailyChart(ocorrencias);
        createTypeChart(ocorrencias);

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar o dashboard.");
    }
}

function updateCards(lista) {
    document.getElementById("totalOcorrencias").textContent = lista.length;
    document.getElementById("ocorrenciasAbertas").textContent = lista.filter(o => o.status === "pendente").length;
    document.getElementById("ocorrenciasProgresso").textContent = lista.filter(o => o.status === "em_andamento").length;
    document.getElementById("ocorrenciasConcluidas").textContent = lista.filter(o => o.status === "concluida").length;
}

function updateRecentList(lista) {
    const ul = document.getElementById("listaUltimasOcorrencias");
    ul.innerHTML = "";

    lista.slice(0, 5).forEach(o => {
        ul.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <strong>${o.tipo}</strong><br>
                    <small>${new Date(o.createdAt).toLocaleString()}</small>
                </div>
                <span class="badge bg-danger">${o.status}</span>
            </li>
        `;
    });
}

function groupByDate(lista) {
    const map = {};
    lista.forEach(o => {
        const dia = o.createdAt.split("T")[0];
        map[dia] = (map[dia] || 0) + 1;
    });
    return map;
}

function createDailyChart(lista) {
    const grouped = groupByDate(lista);
    new Chart(document.getElementById("chartOcorrenciasDiarias"), {
        type: "line",
        data: {
            labels: Object.keys(grouped),
            datasets: [
                {
                    label: "Ocorrências por dia",
                    data: Object.values(grouped)
                }
            ]
        }
    });
}

function createTypeChart(lista) {
    const tipos = {};
    lista.forEach(o => tipos[o.tipo] = (tipos[o.tipo] || 0) + 1);

    new Chart(document.getElementById("chartTipoOcorrencias"), {
        type: "pie",
        data: {
            labels: Object.keys(tipos),
            datasets: [
                {
                    data: Object.values(tipos)
                }
            ]
        }
    });
}
