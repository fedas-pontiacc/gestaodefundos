// Dados iniciais (caso não existam no localStorage)
const membrosPadrao = [
    { nome: 'Ana', total: 0 },
    { nome: 'João', total: 0 },
    { nome: 'Maria', total: 0 },
    { nome: 'Pedro', total: 0 }
];

const historicoPadrao = [];

// ------------------- MEMBROS E DEPÓSITOS -------------------

function carregarMembros() {
    let membros = JSON.parse(localStorage.getItem('membros')) || membrosPadrao;
    // Se estiver vazio, recarrega padrão
    if (membros.length === 0) {
        membros = membrosPadrao;
        localStorage.setItem('membros', JSON.stringify(membros));
    }

    const container = document.getElementById('lista-membros');
    if (!container) return;

    container.innerHTML = '';
    membros.forEach(membro => {
        const card = document.createElement('div');
        card.className = 'membro-card';
        card.innerHTML = `
            <div class="membro-info">
                <h3>${membro.nome}</h3>
                <p>${membro.total} MT</p>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="btn-deposito" data-nome="${membro.nome}" title="Depositar 250 MT"><i class="fas fa-plus"></i></button>
                <button class="btn-remover" data-nome="${membro.nome}" title="Remover membro"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(card);
    });

    // Eventos dos botões
    document.querySelectorAll('.btn-deposito').forEach(btn => {
        btn.addEventListener('click', function() {
            const nome = this.dataset.nome;
            depositar(nome);
        });
    });
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', function() {
            const nome = this.dataset.nome;
            removerMembro(nome);
        });
    });
}

function depositar(nomeMembro) {
    let membros = JSON.parse(localStorage.getItem('membros'));
    const membro = membros.find(m => m.nome === nomeMembro);
    if (membro) {
        membro.total += 250;
        localStorage.setItem('membros', JSON.stringify(membros));

        // Adicionar ao histórico
        const data = new Date();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        let historico = JSON.parse(localStorage.getItem('historico')) || [];
        historico.push({
            membro: nomeMembro,
            mes: mes,
            ano: ano,
            valor: 250
        });
        localStorage.setItem('historico', JSON.stringify(historico));

        carregarMembros();
        carregarHistorico();
        atualizarTotal();
    }
}

function adicionarMembro(nome) {
    let membros = JSON.parse(localStorage.getItem('membros')) || [];
    // Verificar se já existe (ignorando maiúsculas/minúsculas)
    if (membros.some(m => m.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Já existe um membro com esse nome.');
        return;
    }
    membros.push({ nome: nome, total: 0 });
    localStorage.setItem('membros', JSON.stringify(membros));
    carregarMembros();
    atualizarTotal();
}

function removerMembro(nome) {
    if (!confirm(`Tem certeza que deseja remover o membro ${nome}?`)) return;
    let membros = JSON.parse(localStorage.getItem('membros')) || [];
    membros = membros.filter(m => m.nome !== nome);
    localStorage.setItem('membros', JSON.stringify(membros));
    carregarMembros();
    atualizarTotal();
}

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    const tbody = document.getElementById('historico-corpo');
    if (!tbody) return;

    tbody.innerHTML = '';
    historico.slice(-10).reverse().forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.membro}</td>
            <td>${item.mes}</td>
            <td>${item.ano}</td>
            <td>${item.valor} MT</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTotal() {
    const membros = JSON.parse(localStorage.getItem('membros')) || [];
    const total = membros.reduce((acc, m) => acc + m.total, 0);
    const totalSpan = document.getElementById('total-acumulado');
    if (totalSpan) totalSpan.textContent = total;
}

// ------------------- EVENTOS -------------------

function carregarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const container = document.getElementById('eventos-container');
    if (!container) return;

    if (eventos.length === 0) {
        container.innerHTML = '<p>Nenhum evento cadastrado.</p>';
        return;
    }

    eventos.sort((a, b) => new Date(a.data) - new Date(b.data));

    container.innerHTML = '';
    eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = `evento-card ${evento.tipo.toLowerCase()}`;
        card.innerHTML = `
            <div class="evento-header">
                <span class="evento-tipo">${evento.tipo}</span>
                <span class="evento-data">${new Date(evento.data).toLocaleDateString('pt-PT')}</span>
            </div>
            <div class="evento-descricao">${evento.descricao || 'Sem descrição'}</div>
        `;
        container.appendChild(card);
    });
}

function adicionarEvento(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo').value;
    const data = document.getElementById('data').value;
    const descricao = document.getElementById('descricao').value;

    if (!tipo || !data) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos.push({ tipo, data, descricao });
    localStorage.setItem('eventos', JSON.stringify(eventos));

    document.getElementById('form-evento').reset();
    carregarEventos();
}

// ------------------- INICIALIZAÇÃO -------------------

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('membros')) {
        localStorage.setItem('membros', JSON.stringify(membrosPadrao));
    }
    if (!localStorage.getItem('historico')) {
        localStorage.setItem('historico', JSON.stringify(historicoPadrao));
    }
    if (!localStorage.getItem('eventos')) {
        localStorage.setItem('eventos', JSON.stringify([]));
    }
});