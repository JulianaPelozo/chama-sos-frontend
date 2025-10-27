const API_URL = "http://localhost:5000/api";

document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const cpf = document.getElementById("cpf").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        const errorEl = document.getElementById("error");
        const successEl = document.getElementById("success");

        errorEl.textContent = "";
        successEl.textContent = "";

        if (senha !== confirmarSenha) {
            errorEl.textContent = "As senhas não coincidem.";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    dataNascimento,
                    cpf,
                    senha,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                errorEl.textContent = data.message || "Erro ao registrar usuário.";
            } else {
                successEl.textContent = "Cadastro realizado com sucesso!";
                document.getElementById("registerForm").reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }
        } catch (error) {
            console.error("Erro:", error);
            errorEl.textContent = "Erro ao conectar com o servidor.";
        }
    });

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
