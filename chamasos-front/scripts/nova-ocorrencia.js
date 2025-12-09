import { apiRequest } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ocorrenciaForm").addEventListener("submit", salvar);
});

async function salvar(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dados = Object.fromEntries(form.entries());

    dados.quantidadeVitimas = Number(dados.quantidadeVitimas || 0);
    dados.latitude = dados.latitude ? Number(dados.latitude) : null;
    dados.longitude = dados.longitude ? Number(dados.longitude) : null;
    dados.custoOperacao = Number(dados.custoOperacao || 0);

    dados.recursos = form.getAll("recursos[]");

    console.log("Enviando => ", dados);

    try {
        await apiRequest("/ocorrencias", {
            method: "POST",
            body: JSON.stringify(dados),
        });

        alert("Ocorrência registrada com sucesso!");
        window.location.href = "ocorrencias.html";

    } catch (err) {
        console.error("ERRO AO SALVAR", err);
        alert("Erro ao salvar ocorrência. Veja o console.");
    }
}
