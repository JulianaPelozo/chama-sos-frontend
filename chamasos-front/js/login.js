const API_URL = "http://localhost:5000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.querySelector(".error");

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorDiv.textContent = data.message || "Usuário ou senha inválidos.";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Erro na requisição:", err);
    errorDiv.textContent = "Erro de conexão com o servidor.";
  }
}
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});