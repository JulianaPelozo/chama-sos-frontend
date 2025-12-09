document.addEventListener("DOMContentLoaded", () => {


    const profileForm = document.getElementById("profileForm");
    const profileSuccess = document.getElementById("profileSuccess");
    const profileError = document.getElementById("profileError");

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            firstName: document.getElementById("profileFirstName").value,
            lastName: document.getElementById("profileLastName").value,
            email: document.getElementById("profileEmail").value
        };

        try {
            const response = await fetch("http://localhost:3000/usuario/perfil", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                mostrar(profileSuccess, "Alterações salvas com sucesso!");
            } else {
                mostrar(profileError, result.message || "Erro ao salvar.");
            }
        } catch (error) {
            mostrar(profileError, "Erro ao conectar ao servidor.");
        }
    });



    const passwordForm = document.getElementById("passwordForm");
    const passwordSuccess = document.getElementById("passwordSuccess");
    const passwordError = document.getElementById("passwordError");

    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nova = document.getElementById("newPassword").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (nova !== confirm) {
            mostrar(passwordError, "As senhas não coincidem!");
            return;
        }

        const dados = {
            senhaAtual: document.getElementById("currentPassword").value,
            novaSenha: nova
        };

        try {
            const response = await fetch("http://localhost:3000/usuario/senha", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                mostrar(passwordSuccess, "Senha alterada com sucesso!");
                passwordForm.reset();
            } else {
                mostrar(passwordError, result.message || "Erro ao alterar senha.");
            }
        } catch (error) {
            mostrar(passwordError, "Erro ao conectar ao servidor.");
        }
    });


    const darkMode = document.getElementById("darkMode");
    const notifications = document.getElementById("notifications");
    const sounds = document.getElementById("sounds");

    if (localStorage.getItem("darkMode") === "true") {
        darkMode.checked = true;
        document.body.classList.add("dark");
    }

    notifications.checked = localStorage.getItem("notifications") !== "false";
    sounds.checked = localStorage.getItem("sounds") !== "false";

    darkMode.addEventListener("change", () => {
        if (darkMode.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    });

    notifications.addEventListener("change", () => {
        localStorage.setItem("notifications", notifications.checked);
    });

    sounds.addEventListener("change", () => {
        localStorage.setItem("sounds", sounds.checked);
    });



    window.limparCache = () => {
        localStorage.clear();
        alert("Cache local limpo!");
    };

    window.encerrarSessoes = () => {
        fetch("http://localhost:3000/logoutTodas", { method: "POST" });
        alert("Todas as sessões foram encerradas!");
    };

   
    function mostrar(el, msg) {
        el.textContent = msg;
        el.style.display = "block";
        setTimeout(() => el.style.display = "none", 3500);
    }
});
