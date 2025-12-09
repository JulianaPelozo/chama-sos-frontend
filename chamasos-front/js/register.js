document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorMsg = document.getElementById("error");
    const successMsg = document.getElementById("success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        errorMsg.textContent = "";
        successMsg.textContent = "";

        const nome = document.getElementById("nome").value.trim();
        const dataNascimento = document.getElementById("dataNascimento").value;
        const cpf = document.getElementById("cpf").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (senha !== confirmarSenha) {
            errorMsg.textContent = "As senhas não coincidem.";
            return;
        }

        if (!cpf.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)) {
            errorMsg.textContent = "Formato de CPF inválido.";
            return;
        }

        const payload = {
            nome,
            dataNascimento,
            cpf,
            senha
        };

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                errorMsg.textContent = (result.message || "Erro no cadastro.");
                return;
            }

            successMsg.textContent = "Cadastro realizado com sucesso! Redirecionando...";
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);

        } catch (error) {
            errorMsg.textContent = "Erro ao conectar com o servidor.";
            console.error("Erro:", error);
        }
    });

    // Botão de fechar modal
    document.getElementById("closeBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
