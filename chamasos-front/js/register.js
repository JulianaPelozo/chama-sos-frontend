const API_URL = "http://localhost:5000/api";

document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const dataNascimento = document.getElementById("dataNascimento").value;
        const cpf = document.getElementById("cpf").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        const errorEl = document.getElementById("error");
        const successEl = document.getElementById("success");

        errorEl.textContent = "";
        successEl.textContent = "";

        if (!nome || !dataNascimento || !cpf || !senha) {
            errorEl.textContent = "Preencha todos os campos obrigatórios.";
            return;
        }

        if (senha !== confirmarSenha) {
            errorEl.textContent = "As senhas não coincidem.";
            return;
        }

        if (senha.length < 6) {
            errorEl.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
            errorEl.textContent = "CPF inválido. Digite os 11 dígitos.";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    dataNascimento,
                    cpf: cpfLimpo,
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
    window.location.href = "index.html";
});

document.getElementById("cpf").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    e.target.value = value;
});
