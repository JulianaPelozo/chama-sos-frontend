const API_URL = "http://localhost:5000/api";

function verificarAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return null;
    }
    return token;
}

async function carregarPerfil() {
    const token = verificarAuth();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/me`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (res.ok) {
            const user = await res.json();
            document.getElementById("profileFirstName").value = user.firstName || "";
            document.getElementById("profileLastName").value = user.lastName || "";
            document.getElementById("profileEmail").value = user.email || "";
        }
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = verificarAuth();
    if (!token) return;

    const dados = {
        firstName: document.getElementById("profileFirstName").value,
        lastName: document.getElementById("profileLastName").value,
        email: document.getElementById("profileEmail").value,
    };

    const successEl = document.getElementById("profileSuccess");
    const errorEl = document.getElementById("profileError");
    successEl.textContent = "";
    errorEl.textContent = "";

    try {
        const res = await fetch(`${API_URL}/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(dados),
        });

        if (res.ok) {
            successEl.textContent = "Perfil atualizado com sucesso!";
            setTimeout(() => successEl.textContent = "", 3000);
        } else {
            const data = await res.json();
            errorEl.textContent = data.message || "Erro ao atualizar perfil";
        }
    } catch (error) {
        console.error("Erro:", error);
        errorEl.textContent = "Erro ao conectar com o servidor";
    }
});

document.getElementById("passwordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = verificarAuth();
    if (!token) return;

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const successEl = document.getElementById("passwordSuccess");
    const errorEl = document.getElementById("passwordError");
    successEl.textContent = "";
    errorEl.textContent = "";

    if (newPassword !== confirmPassword) {
        errorEl.textContent = "As senhas não coincidem";
        return;
    }

    if (newPassword.length < 6) {
        errorEl.textContent = "A nova senha deve ter pelo menos 6 caracteres";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        if (res.ok) {
            successEl.textContent = "Senha alterada com sucesso!";
            document.getElementById("passwordForm").reset();
            setTimeout(() => successEl.textContent = "", 3000);
        } else {
            const data = await res.json();
            errorEl.textContent = data.message || "Erro ao alterar senha";
        }
    } catch (error) {
        console.error("Erro:", error);
        errorEl.textContent = "Erro ao conectar com o servidor";
    }
});

function carregarConfiguracoes() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    const notifications = localStorage.getItem("notifications") !== "false";
    const sounds = localStorage.getItem("sounds") !== "false";

    document.getElementById("darkMode").checked = darkMode;
    document.getElementById("notifications").checked = notifications;
    document.getElementById("sounds").checked = sounds;

    if (darkMode) {
        document.body.classList.add("dark-mode");
    }
}

document.getElementById("darkMode").addEventListener("change", (e) => {
    localStorage.setItem("darkMode", e.target.checked);
    document.body.classList.toggle("dark-mode", e.target.checked);
});

document.getElementById("notifications").addEventListener("change", (e) => {
    localStorage.setItem("notifications", e.target.checked);
});

document.getElementById("sounds").addEventListener("change", (e) => {
    localStorage.setItem("sounds", e.target.checked);
});

function limparCache() {
    if (confirm("Tem certeza que deseja limpar o cache local?")) {
        const token = localStorage.getItem("token");
        
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== "token") {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        if ("caches" in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }

        alert("Cache limpo com sucesso!");
        location.reload();
    }
}

function encerrarSessoes() {
    if (confirm("Tem certeza que deseja encerrar todas as sessões? Você será desconectado.")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
});

carregarPerfil();
carregarConfiguracoes();
