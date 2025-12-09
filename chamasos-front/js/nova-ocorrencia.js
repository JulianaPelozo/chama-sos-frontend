const API_URL = "http://localhost:5000/api";

function verificarAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return null;
    }
    return token;
}

document.getElementById("ocorrenciaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = verificarAuth();
    if (!token) return;

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const localizacao = document.getElementById("localizacao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    const tipo = document.getElementById("tipo").value;
    const mensagemEl = document.getElementById("mensagem");

    mensagemEl.textContent = "";
    mensagemEl.style.color = "";

    try {
        const res = await fetch(`${API_URL}/ocorrencias/novaocorrencia`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ 
                titulo, 
                descricao, 
                localizacao,
                prioridade,
                tipo,
                status: "pendente"
            }),
        });

        const data = await res.json();

        if (res.ok) {
            mensagemEl.innerHTML = `
                <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; text-align: center;">
                    ✅ Ocorrência registrada com sucesso!<br>
                    <small>Redirecionando para a lista de ocorrências...</small>
                </div>
            `;
            e.target.reset();

            setTimeout(() => {
                window.location.href = "ocorrencias.html";
            }, 2000);
        } else {
            mensagemEl.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 10px; text-align: center;">
                    ❌ ${data.message || "Erro ao registrar ocorrência."}
                </div>
            `;
        }
    } catch (err) {
        console.error("Erro:", err);
        mensagemEl.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 10px; text-align: center;">
                ❌ Erro de conexão com o servidor.
            </div>
        `;
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
});

verificarAuth();
