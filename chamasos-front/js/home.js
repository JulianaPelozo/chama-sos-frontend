const API_URL = "http://localhost:5000/api";

function verificarAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return null;
    }
    return token;
}

async function carregarDadosUsuario() {
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
            const nome = user.firstName || user.nome || "Usuário";
            document.getElementById("userName").textContent = `Olá, ${nome}`;
        } else {
            document.getElementById("userName").textContent = "Bem-vindo!";
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        document.getElementById("userName").textContent = "Bem-vindo!";
    }
}

async function carregarEstatisticas() {
    const token = verificarAuth();
    if (!token) return;

    try {
        const usersRes = await fetch(`${API_URL}/listalogins`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (usersRes.ok) {
            const users = await usersRes.json();
            const totalUsers = Array.isArray(users) ? users.length : 0;
            document.getElementById("totalUsers").textContent = totalUsers;
        } else {
            document.getElementById("totalUsers").textContent = "—";
        }

        const occRes = await fetch(`${API_URL}/ocorrencias`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (occRes.ok) {
            const ocorrencias = await occRes.json();
            const lista = Array.isArray(ocorrencias) ? ocorrencias : [];
            const total = lista.length;
            const pendentes = lista.filter(o => o.status === "pendente" || !o.status).length;
            const resolvidas = lista.filter(o => o.status === "resolvida").length;

            document.getElementById("totalOccurrences").textContent = total;
            document.getElementById("pendingOccurrences").textContent = pendentes;
            document.getElementById("resolvedOccurrences").textContent = resolvidas;

            const ordenadas = lista.sort((a, b) => {
                const dataA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dataB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dataB - dataA;
            });
            carregarUltimasOcorrencias(ordenadas.slice(0, 5));
        } else {
            document.getElementById("totalOccurrences").textContent = "—";
            document.getElementById("pendingOccurrences").textContent = "—";
            document.getElementById("resolvedOccurrences").textContent = "—";
            
            document.getElementById("recentOccurrences").innerHTML = `
                <tr><td colspan="4" class="empty-text">Nenhuma ocorrência encontrada</td></tr>
            `;
        }

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        document.getElementById("totalUsers").textContent = "—";
        document.getElementById("totalOccurrences").textContent = "—";
        document.getElementById("pendingOccurrences").textContent = "—";
        document.getElementById("resolvedOccurrences").textContent = "—";
        
        document.getElementById("recentOccurrences").innerHTML = `
            <tr><td colspan="4" class="error-text">Erro ao conectar com servidor</td></tr>
        `;
    }
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function carregarUltimasOcorrencias(ocorrencias) {
    const tbody = document.getElementById("recentOccurrences");
    
    if (!ocorrencias || ocorrencias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-text">Nenhuma ocorrência encontrada</td></tr>`;
        return;
    }

    tbody.innerHTML = ocorrencias.map(oc => {
        const status = oc.status || "pendente";
        const statusClass = status === "resolvida" ? "status-resolved" : 
                           status === "em_andamento" ? "status-progress" : "status-pending";
        const statusText = status === "resolvida" ? "Resolvida" : 
                          status === "em_andamento" ? "Em Andamento" : "Pendente";
        
        const data = oc.createdAt ? new Date(oc.createdAt).toLocaleDateString('pt-BR') : "—";
        const titulo = escapeHtml(oc.titulo || "—");
        const localizacao = escapeHtml(oc.localizacao || "—");
        
        return `
            <tr>
                <td>${titulo}</td>
                <td>${localizacao}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${data}</td>
            </tr>
        `;
    }).join("");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
});

carregarDadosUsuario();
carregarEstatisticas();
