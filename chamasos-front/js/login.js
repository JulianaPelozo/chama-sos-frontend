document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const senhaInput = document.getElementById("senha");

    togglePassword.addEventListener("click", () => {
        const type = senhaInput.type === "password" ? "text" : "password";
        senhaInput.type = type;

        togglePassword.innerHTML =
            type === "password"
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const matricula = document.getElementById("matricula").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!matricula || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ matricula, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Erro ao fazer login.");
                return;
            }

            localStorage.setItem("userName", data.nome);
            localStorage.setItem("token", data.token); 

            window.location.href = "home.html";

        } catch (error) {
            console.error("Erro no fetch:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    });

});
