document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("usuario").value.trim();
  const password = document.getElementById("senha").value.trim();
  const errorMsg = document.getElementById("error");

  errorMsg.textContent = "";

  if (!identifier || !password) {
    errorMsg.textContent = "Preencha usuário e senha.";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.message || "Erro ao fazer login.";
      return;
    }

  
    console.log("✅ Login realizado:", data);

    localStorage.setItem("token", data.token);

    window.location.href = "home.html"; 
  } catch (error) {
    console.error("❌ Erro de conexão:", error);
    errorMsg.textContent = "Erro de conexão com o servidor.";
  }
});
