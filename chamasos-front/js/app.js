const API_URL = 'http://localhost:3000/api/ocorrencias';
let isAuthenticated = false; // Variável de controle de autenticação

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização
    checkAuthentication();
    window.addEventListener('hashchange', router);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    router();
});

// --- ROTEAMENTO E AUTENTICAÇÃO ---

function checkAuthentication() {
    // Simulação: Verifica se há um token/flag no LocalStorage
    isAuthenticated = localStorage.getItem('chamaSosAuth') === 'true';
    if (isAuthenticated) {
        document.getElementById('mainNavbar').style.display = 'flex';
    } else {
        document.getElementById('mainNavbar').style.display = 'none';
    }
}

function router() {
    const hash = window.location.hash.substring(1);
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ''; // Limpa o conteúdo anterior

    if (!isAuthenticated) {
        renderLoginPage(mainContent);
        return;
    }

    switch (hash) {
        case 'nova-ocorrencia':
            renderNovaOcorrenciaPage(mainContent);
            break;
        case 'perfil':
            renderPerfilPage(mainContent);
            break;
        case 'acompanhamento':
        case '': // Rota padrão
            renderAcompanhamentoPage(mainContent);
            break;
        default:
            mainContent.innerHTML = '<div class="alert alert-danger">Página não encontrada!</div>';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    // SIMULAÇÃO DE AUTENTICAÇÃO
    if (matricula === '1234' && senha === 'bombeiro') {
        localStorage.setItem('chamaSosAuth', 'true');
        isAuthenticated = true;
        checkAuthentication();
        window.location.hash = 'acompanhamento';
    } else {
        alert('Matrícula ou senha inválida.');
    }
}

function handleLogout() {
    localStorage.removeItem('chamaSosAuth');
    isAuthenticated = false;
    checkAuthentication();
    window.location.hash = 'login';
}

// --- RENDERS DE PÁGINAS ---

function renderLoginPage(container) {
    container.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-lg border-0">
                    <div class="card-header bg-primary text-white text-center">
                        <h4>Acesso Bombeiros - Chama SOS</h4>
                    </div>
                    <div class="card-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="matricula" class="form-label">Matrícula</label>
                                <input type="text" class="form-control" id="matricula" required value="1234">
                            </div>
                            <div class="mb-3">
                                <label for="senha" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="senha" required value="bombeiro">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Entrar</button>
                            <p class="mt-3 text-center text-muted">Use: 1234 / bombeiro</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function renderNovaOcorrenciaPage(container) {
    container.innerHTML = `
        <h1 class="mb-4 text-primary">🔴 Registrar Nova Ocorrência</h1>
        <div class="card mb-4">
            <div class="card-header card-header-blue text-white">
                Detalhes da Ocorrência
            </div>
            <div class="card-body">
                <form id="ocorrenciaForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="tipo" class="form-label">Tipo de Ocorrência</label>
                            <select id="tipo" class="form-select" required>
                                <option value="">Selecione...</option>
                                <option value="Resgate">Resgate</option>
                                <option value="Incêndio">Incêndio</option>
                                <option value="Desabamento">Desabamento</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="vitimas" class="form-label">Vítimas (Qtd.)</label>
                            <input type="number" class="form-control" id="vitimas" min="0" required>
                        </div>
                        <div class="col-md-6">
                            <label for="localizacao" class="form-label">Localização</label>
                            <select id="localizacao" class="form-select" required>
                                <option value="">Selecione...</option>
                                <option value="Residencial">Residencial</option>
                                <option value="Comercial">Comercial</option>
                                <option value="Público">Público</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="custo" class="form-label">Custo Estimado (R$)</label>
                            <input type="number" step="0.01" class="form-control" id="custo" min="0" required>
                        </div>
                        <div class="col-md-6">
                            <label for="batalhao" class="form-label">Batalhão Chamado</label>
                            <input type="text" class="form-control" id="batalhao" value="Recife Metropolitano I" required>
                        </div>
                        <div class="col-12">
                            <label for="descricao" class="form-label">Descrição da Ocorrência</label>
                            <textarea class="form-control" id="descricao" rows="3" required></textarea>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Salvar Ocorrência</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('ocorrenciaForm').addEventListener('submit', handleCreateOcorrencia);
}

function renderAcompanhamentoPage(container) {
    container.innerHTML = `
        <h1 class="mb-4 text-primary">🟡 Acompanhamento de Ocorrências</h1>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Vítimas</th>
                        <th>Local</th>
                        <th>Custo (R$)</th>
                        <th>Batalhão</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="ocorrenciasTableBody">
                    <tr><td colspan="8" class="text-center">Carregando ocorrências...</td></tr>
                </tbody>
            </table>
        </div>
    `;
    fetchOcorrencias();
    // Reassocia o listener do Modal de Edição (pois o elemento 'editForm' foi recriado)
    document.getElementById('editForm').addEventListener('submit', handleUpdateStatus);
}

function renderPerfilPage(container) {
    container.innerHTML = `
        <h1 class="mb-4 text-primary">👤 Meu Perfil</h1>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Informações do Bombeiro</h5>
                <p><strong>Nome:</strong> João da Silva</p>
                <p><strong>Matrícula:</strong> 1234</p>
                <p><strong>Batalhão:</strong> Recife Metropolitano I</p>
                <p><strong>Função:</strong> Resgatista/Motorista</p>
                <hr>
                <button class="btn btn-outline-danger" id="logoutBtnPerfil">Sair</button>
            </div>
        </div>
    `;
    document.getElementById('logoutBtnPerfil').addEventListener('click', handleLogout);
}


// --- FUNÇÕES CRUD (MANTIDAS DO CÓDIGO ANTERIOR) ---

async function fetchOcorrencias() {
    // ... Lógica fetchOcorrencias (manter) ...
    try {
        const response = await fetch(API_URL);
        const ocorrencias = await response.json();
        renderOcorrencias(ocorrencias);
    } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
        document.getElementById('ocorrenciasTableBody').innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar dados. Verifique o backend.</td></tr>';
    }
}

function renderOcorrencias(ocorrencias) {
    const tableBody = document.getElementById('ocorrenciasTableBody');
    if (!tableBody) return; 

    tableBody.innerHTML = '';
    // ... Lógica renderOcorrencias (manter, incluindo listeners de edit/delete) ...
    if (ocorrencias.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma ocorrência registrada.</td></tr>';
        return;
    }

    ocorrencias.forEach(ocorrencia => {
        const row = tableBody.insertRow();
        const statusClass = getStatusClass(ocorrencia.status);

        row.innerHTML = `
            <td>${ocorrencia.id}</td>
            <td>${ocorrencia.tipo}</td>
            <td>${ocorrencia.vitimas}</td>
            <td>${ocorrencia.localizacao}</td>
            <td>${parseFloat(ocorrencia.custo).toFixed(2)}</td>
            <td>${ocorrencia.batalhao}</td>
            <td><span class="badge ${statusClass}">${ocorrencia.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${ocorrencia.id}" data-status="${ocorrencia.status}">Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${ocorrencia.id}">Excluir</button>
            </td>
        `;

        const editButton = row.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            document.getElementById('editId').value = ocorrencia.id;
            document.getElementById('editStatus').value = ocorrencia.status;
            // O modal é aberto pelo Bootstrap
        });
        
        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir a ocorrência ID ${ocorrencia.id}?`)) {
                handleDeleteOcorrencia(ocorrencia.id);
            }
        });
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'Concluída': return 'bg-success';
        case 'Em Andamento': return 'bg-info';
        case 'Pendente': return 'bg-warning';
        case 'Cancelada': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

async function handleCreateOcorrencia(event) {
    event.preventDefault();
    // ... Lógica handleCreateOcorrencia (manter) ...
    const data = {
        tipo: document.getElementById('tipo').value,
        vitimas: parseInt(document.getElementById('vitimas').value),
        localizacao: document.getElementById('localizacao').value,
        custo: parseFloat(document.getElementById('custo').value),
        batalhao: document.getElementById('batalhao').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Ocorrência registrada com sucesso! Redirecionando para acompanhamento.');
            window.location.hash = 'acompanhamento';
        } else {
            alert('Falha ao registrar ocorrência.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o backend.');
    }
}

async function handleUpdateStatus(event) {
    event.preventDefault();
    // ... Lógica handleUpdateStatus (manter) ...
    const id = document.getElementById('editId').value;
    const status = document.getElementById('editStatus').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert('Status atualizado com sucesso!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            fetchOcorrencias();
        } else {
            alert('Falha ao atualizar status.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o backend.');
    }
}

async function handleDeleteOcorrencia(id) {
    // ... Lógica handleDeleteOcorrencia (manter) ...
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            alert('Ocorrência excluída com sucesso!');
            fetchOcorrencias();
        } else {
            alert('Falha ao excluir ocorrência.');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o backend.');
    }
}