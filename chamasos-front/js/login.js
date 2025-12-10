document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    const USUARIO_TESTE = {
        matricula: "123",
        senha: "123"
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const matricula = document.getElementById("matricula").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (matricula === USUARIO_TESTE.matricula && senha === USUARIO_TESTE.senha) {

            localStorage.setItem("userName", "Usuário Teste");
            localStorage.setItem("userId", "1");
            localStorage.setItem("matricula", matricula);

            localStorage.setItem("token", "fake-token-teste");

            window.location.href = "home.html";
        } else {
            alert("Matrícula ou senha incorretas.");
        }
    });
});
