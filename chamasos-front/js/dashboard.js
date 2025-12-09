document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#userTable tbody");
    const searchInput = document.getElementById("searchInput");

    carregarUsuarios();

    async function carregarUsuarios() {
        tableBody.innerHTML = `
            <tr><td colspan="5" class="loading-text">Carregando usuários...</td></tr>
        `;

        try {
            const response = await fetch("http://localhost:3000/usuarios");
            const data = await response.json();

            if (!response.ok) {
                tableBody.innerHTML = `
                    <tr><td colspan="5" class="loading-text">Erro ao carregar usuários.</td></tr>
                `;
                return;
            }

            exibirUsuarios(data);
        } catch (error) {
            tableBody.innerHTML = `
                <tr><td colspan="5" class="loading-text">Falha ao conectar ao servidor.</td></tr>
            `;
            console.error(error);
        }
    }

    function exibirUsuarios(usuarios) {
        if (usuarios.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="loading-text">Nenhum usuário encontrado.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";

        usuarios.forEach(usuario => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cpf}</td>
                <td>${usuario.funcao || "—"}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    searchInput.addEventListener("input", () => {
        const termo = searchInput.value.toLowerCase();

        const linhas = tableBody.querySelectorAll("tr");

        linhas.forEach(linha => {
            const texto = linha.innerText.toLowerCase();

            linha.style.display = texto.includes(termo) ? "" : "none";
        });
    });
});
