async function verificarToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/dashboard", {
      headers: { Authorization: "Bearer " + token },
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("content").innerHTML = `
        <div class="card">
          <h3>${data.message}</h3>
        </div>
      `;
    } else {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

verificarToken();
