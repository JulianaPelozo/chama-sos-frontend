document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ocorrenciaForm");
    const msg = document.getElementById("mensagem");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            titulo: document.getElementById("titulo").value.trim(),
            descricao: document.getElementById("descricao").value.trim(),
            localizacao: document.getElementById("localizacao").value.trim(),
            prioridade: document.getElementById("prioridade").value,
            tipo: document.getElementById("tipo").value
        };

        try {
            const response = await fetch("http://localhost:3000/ocorrencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensagem("Ocorrência registrada com sucesso!", "sucesso");

                form.reset();
            } else {
                mostrarMensagem(result.message || "Erro ao registrar ocorrência", "erro");
            }
        } catch (error) {
            console.error(error);
            mostrarMensagem("Erro ao conectar com o servidor", "erro");
        }
    });

    function mostrarMensagem(texto, tipo) {
        msg.textContent = texto;
        msg.className = "mensagem " + tipo;
        msg.style.display = "block";

        setTimeout(() => {
            msg.style.display = "none";
        }, 4000);
    }
});
