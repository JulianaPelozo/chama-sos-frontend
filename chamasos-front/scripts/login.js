alert("LOGIN.JS ESTÁ RODANDO!");
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    const LOGIN_MATRICULA = "123456";
    const LOGIN_SENHA = "bombeiro123";

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const matricula = document.getElementById("matricula").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!matricula || !senha) {
            alert("Digite matrícula e senha.");
            return;
        }

        if (matricula !== LOGIN_MATRICULA || senha !== LOGIN_SENHA) {
            alert("Matrícula ou senha incorretas.");
            return;
        }

        localStorage.setItem("token", "token-simulacao");
        localStorage.setItem("user", JSON.stringify({
            nome: "Bombeiro Teste",
            matricula,
            batalhao: "1º BBM - Recife"
        }));

        window.location.href = "dashboard.html";
    });

    document.getElementById("togglePassword")?.addEventListener("click", () => {
        const pw = document.getElementById("senha");
        pw.type = pw.type === "password" ? "text" : "password";
    });
});
