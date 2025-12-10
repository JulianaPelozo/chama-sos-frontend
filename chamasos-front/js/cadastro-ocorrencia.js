const API_URL = "http://127.0.0.1:3000/ocorrencias";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("ocorrenciaForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            titulo: document.getElementById("titulo").value,
            descricao: document.getElementById("descricao").value,
            localizacao: document.getElementById("localizacao").value,
            prioridade: document.getElementById("prioridade").value,
            tipo: document.getElementById("tipo").value,
            observacoes: document.getElementById("observacoes").value
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            alert("Ocorrência cadastrada com sucesso!");
            form.reset();

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar ocorrência.");
        }
    });
});
