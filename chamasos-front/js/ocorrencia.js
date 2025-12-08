document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ocorrenciasTable')) {
        loadOcorrencias();
    }
    
    if (document.getElementById('ocorrenciaForm')) {
        initForm();
        if (window.location.search.includes('edit')) {
            loadOcorrenciaForEdit();
        }
    }
    
    if (document.getElementById('statsCards')) {
        loadDashboardStats();
    }
});

// Carregar ocorrências
async function loadOcorrencias() {
    const tableBody = document.getElementById('ocorrenciasTable');
    if (!tableBody) return;
    
    showLoading(tableBody);
    
    try {
        ocorrencias = await apiRequest('/ocorrencias');
        renderOcorrenciasTable(ocorrencias);
    } catch (error) {
        showError('Erro ao carregar ocorrências', tableBody);
    }
}

// Renderizar tabela de ocorrências
function renderOcorrenciasTable(ocorrencias) {
    const tableBody = document.getElementById('ocorrenciasTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    ocorrencias.forEach(ocorrencia => {
        const row = document.createElement('tr');
        
        // Definir badge baseado no tipo
        let badgeClass = 'badge-incendio';
        if (ocorrencia.tipo.toLowerCase().includes('resgate')) badgeClass = 'badge-resgate';
        if (ocorrencia.tipo.toLowerCase().includes('desabamento')) badgeClass = 'badge-desabamento';
        
        row.innerHTML = `
            <td>#${ocorrencia.id}</td>
            <td>
                <span class="badge ${badgeClass}">${ocorrencia.tipo}</span>
            </td>
            <td>${ocorrencia.descricao.substring(0, 50)}...</td>
            <td>${ocorrencia.quantidadeVitimas}</td>
            <td>${ocorrencia.localTipo}</td>
            <td>${formatCurrency(ocorrencia.custoOperacao)}</td>
            <td>${ocorrencia.batalhao}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(ocorrencia.status)}">
                    ${formatStatus(ocorrencia.status)}
                </span>
            </td>
            <td>${formatDate(ocorrencia.createdAt)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-primary-chama btn-chama" onclick="editOcorrencia(${ocorrencia.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger-chama btn-chama" onclick="deleteOcorrencia(${ocorrencia.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Inicializar formulário
function initForm() {
    const form = document.getElementById('ocorrenciaForm');
    if (!form) return;
    
    // Preencher select de batalhões
    const batalhaoSelect = document.getElementById('batalhao');
    const batalhoes = [
        '1º BBM - Recife',
        '2º BBM - Jaboatão',
        '3º BBM - Olinda',
        '4º BBM - Paulista',
        '5º BBM - Cabo',
        '6º BBM - Goiana',
        '7º BBM - Caruaru'
    ];
    
    batalhoes.forEach(batalhao => {
        const option = document.createElement('option');
        option.value = batalhao;
        option.textContent = batalhao;
        batalhaoSelect.appendChild(option);
    });
    
    // Configurar máscara de moeda
    const custoInput = document.getElementById('custoOperacao');
    custoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2);
        e.target.value = formatCurrency(value).replace('R$', '').trim();
    });
    
    // Enviar formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const ocorrenciaData = {
            tipo: formData.get('tipo'),
            quantidadeVitimas: parseInt(formData.get('quantidadeVitimas')),
            localTipo: formData.get('localTipo'),
            custoOperacao: parseFloat(formData.get('custoOperacao').replace('.', '').replace(',', '.')),
            batalhao: formData.get('batalhao'),
            descricao: formData.get('descricao'),
            status: formData.get('status')
        };
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        try {
            const isEdit = window.location.search.includes('edit');
            let result;
            
            if (isEdit) {
                const id = new URLSearchParams(window.location.search).get('edit');
                result = await apiRequest(`/ocorrencias/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(ocorrenciaData)
                });
                showNotification('Sucesso!', 'Ocorrência atualizada com sucesso!');
            } else {
                result = await apiRequest('/ocorrencias', {
                    method: 'POST',
                    body: JSON.stringify(ocorrenciaData)
                });
                showNotification('Sucesso!', 'Nova ocorrência registrada!');
            }
            
            setTimeout(() => {
                window.location.href = 'ocorrencias.html';
            }, 1500);
            
        } catch (error) {
            alert('Erro ao salvar ocorrência');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Carregar ocorrência para edição
async function loadOcorrenciaForEdit() {
    const id = new URLSearchParams(window.location.search).get('edit');
    if (!id) return;
    
    try {
        const ocorrencia = await apiRequest(`/ocorrencias/${id}`);
        
        // Preencher formulário
        document.getElementById('tipo').value = ocorrencia.tipo;
        document.getElementById('quantidadeVitimas').value = ocorrencia.quantidadeVitimas;
        document.getElementById('localTipo').value = ocorrencia.localTipo;
        document.getElementById('custoOperacao').value = formatCurrency(ocorrencia.custoOperacao).replace('R$', '').trim();
        document.getElementById('batalhao').value = ocorrencia.batalhao;
        document.getElementById('descricao').value = ocorrencia.descricao;
        document.getElementById('status').value = ocorrencia.status;
        
        // Atualizar título
        document.querySelector('h2').textContent = 'Editar Ocorrência';
    } catch (error) {
        alert('Erro ao carregar ocorrência para edição');
        window.location.href = 'ocorrencias.html';
    }
}

// Editar ocorrência
function editOcorrencia(id) {
    window.location.href = `editar-ocorrencia.html?edit=${id}`;
}

// Deletar ocorrência
async function deleteOcorrencia(id) {
    if (!confirm('Tem certeza que deseja excluir esta ocorrência?')) return;
    
    try {
        await apiRequest(`/ocorrencias/${id}`, {
            method: 'DELETE'
        });
        
        showNotification('Sucesso!', 'Ocorrência excluída com sucesso!');
        loadOcorrencias();
    } catch (error) {
        alert('Erro ao excluir ocorrência');
    }
}

// Carregar estatísticas do dashboard
async function loadDashboardStats() {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    try {
        const stats = await apiRequest('/ocorrencias/stats');
        renderDashboardStats(stats);
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Renderizar estatísticas do dashboard
function renderDashboardStats(stats) {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="col-md-3 mb-4">
            <div class="stat-card">
                <div class="stat-icon text-danger">
                    <i class="fas fa-fire"></i>
                </div>
                <h3 class="stat-number">${stats.total}</h3>
                <p class="text-muted">Total de Ocorrências</p>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="stat-card">
                <div class="stat-icon text-warning">
                    <i class="fas fa-spinner"></i>
                </div>
                <h3 class="stat-number">${stats.emAndamento}</h3>
                <p class="text-muted">Em Andamento</p>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="stat-card">
                <div class="stat-icon text-success">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="stat-number">${stats.finalizadas}</h3>
                <p class="text-muted">Finalizadas</p>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="stat-card">
                <div class="stat-icon text-primary">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <h3 class="stat-number">${stats.porTipo.length}</h3>
                <p class="text-muted">Tipos Diferentes</p>
            </div>
        </div>
    `;
}

// Helper functions
function getStatusBadgeClass(status) {
    switch(status) {
        case 'pendente': return 'badge-warning';
        case 'em_andamento': return 'badge-info';
        case 'finalizada': return 'badge-success';
        default: return 'badge-secondary';
    }
}

function formatStatus(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'em_andamento': 'Em Andamento',
        'finalizada': 'Finalizada'
    };
    return statusMap[status] || status;
}