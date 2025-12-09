document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const errorBox = document.getElementById("error");
    const successBox = document.getElementById("success");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.textContent = "";
        successBox.textContent = "";

        const nome = document.getElementById("nome").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const dataNascimento = document.getElementById("dataNascimento").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

        if (!nome || !cpf || !dataNascimento || !senha || !confirmarSenha) {
            errorBox.textContent = "Preencha todos os campos.";
            return;
        }

        if (senha !== confirmarSenha) {
            errorBox.textContent = "As senhas não coincidem.";
            return;
        }

        if (senha.length < 6) {
            errorBox.textContent = "A senha deve ter no mínimo 6 caracteres.";
            return;
        }

        // 🔍 Gerar matricula automática: primeira letra do nome + 4 números aleatórios
        const matricula = nome.split(" ")[0].substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    matricula,
                    senha,
                    dataNascimento
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorBox.textContent = data.message || "Erro ao cadastrar.";
                return;
            }

            successBox.textContent = "Cadastro realizado com sucesso! Redirecionando...";

            setTimeout(() => {
                window.location.href = "index.html"; // volta para login
            }, 1500);

        } catch (err) {
            console.error("Erro no fetch:", err);
            errorBox.textContent = "Não foi possível conectar ao servidor.";
        }
    });

    document.getElementById("closeBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });

});
