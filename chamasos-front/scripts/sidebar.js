document.addEventListener("DOMContentLoaded", () => {
    const sidebar = `
        <aside class="sidebar shadow">

            <div class="sidebar-header">
                <img src="logo.svg" class="sidebar-logo">
                <h4>Chama SOS</h4>
            </div>

            <nav class="sidebar-nav">

                <a href="dashboard.html" class="sidebar-item">
                    <i class="fa fa-gauge"></i> Dashboard
                </a>

                <a href="ocorrencias.html" class="sidebar-item">
                    <i class="fa fa-list"></i> Ocorrências
                </a>

                <a href="nova-ocorrencia.html" class="sidebar-item">
                    <i class="fa fa-plus-circle"></i> Nova Ocorrência
                </a>

                <a href="perfil.html" class="sidebar-item">
                    <i class="fa fa-user"></i> Perfil
                </a>

                <hr>

                <a href="#" class="sidebar-item text-danger" onclick="logout()">
                    <i class="fa fa-sign-out-alt"></i> Sair
                </a>

            </nav>

        </aside>
    `;

    document.getElementById("sidebar").innerHTML = sidebar;
});
