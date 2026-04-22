export function renderResults(matchResults) {
    showResults();
    renderSummary(matchResults);
    renderTables(matchResults);
}

export function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
}

export function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showResults() {
    document.getElementById('results').classList.remove('hidden');
}

function renderSummary(matchResults) {
    const divergent = calculateDivergent(matchResults);
    
    renderDivergentCount(divergent.count);
    renderDivergentSum(divergent.sum);
}

function calculateDivergent(matchResults) {
    const divergentMatches = matchResults.filter(isDivergent);
    
    return {
        count: divergentMatches.length,
        sum: sumAmounts(divergentMatches)
    };
}

function isDivergent(match) {
    return (match.card && !match.app) || (!match.card && match.app);
}

function sumAmounts(matches) {
    return matches.reduce((sum, match) => {
        const amount = match.card?.amountInCents || match.app?.amountInCents || 0;
        return sum + amount;
    }, 0);
}

function renderDivergentCount(count) {
    document.getElementById('divergent-count').textContent = count;
}

function renderDivergentSum(sumInCents) {
    const formatted = formatCurrency(sumInCents);
    document.getElementById('divergent-sum').textContent = formatted;
}

function renderTables(matchResults) {
    const categorized = categorizeMatches(matchResults);
    
    renderMatchedTable(categorized.matched);
    renderCardOnlyTable(categorized.cardOnly);
    renderAppOnlyTable(categorized.appOnly);
}

function categorizeMatches(matchResults) {
    const matched = [];
    const cardOnly = [];
    const appOnly = [];
    
    for (const match of matchResults) {
        if (match.card && match.app) {
            matched.push(match);
        } else if (match.card && !match.app) {
            cardOnly.push(match);
        } else if (!match.card && match.app) {
            appOnly.push(match);
        }
    }
    
    return { matched, cardOnly, appOnly };
}

function renderMatchedTable(matches) {
    const tbody = document.querySelector('#matched-table tbody');
    clearTable(tbody);
    
    if (matches.length === 0) {
        renderEmptyMessage(tbody, 5);
        return;
    }
    
    const sortedMatches = [...matches].sort((a, b) => {
        return new Date(a.card.date) - new Date(b.card.date);
    });
    
    for (const match of sortedMatches) {
        const row = createMatchedRow(match);
        tbody.appendChild(row);
    }
}

function renderCardOnlyTable(matches) {
    const tbody = document.querySelector('#card-only-table tbody');
    clearTable(tbody);
    
    if (matches.length === 0) {
        renderEmptyMessage(tbody, 3);
        return;
    }
    
    const sortedMatches = [...matches].sort((a, b) => {
        return new Date(a.card.date) - new Date(b.card.date);
    });
    
    for (const match of sortedMatches) {
        const row = createTransactionRow(match.card);
        tbody.appendChild(row);
    }
}

function renderAppOnlyTable(matches) {
    const tbody = document.querySelector('#app-only-table tbody');
    clearTable(tbody);
    
    if (matches.length === 0) {
        renderEmptyMessage(tbody, 3);
        return;
    }
    
    const sortedMatches = [...matches].sort((a, b) => {
        return new Date(a.app.date) - new Date(b.app.date);
    });
    
    for (const match of sortedMatches) {
        const row = createTransactionRow(match.app);
        tbody.appendChild(row);
    }
}

function clearTable(tbody) {
    tbody.innerHTML = '';
}

function renderEmptyMessage(tbody, colspan) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = colspan;
    cell.className = 'empty-message';
    cell.textContent = 'Nenhuma transação encontrada';
    row.appendChild(cell);
    tbody.appendChild(row);
}

function createMatchedRow(match) {
    const row = document.createElement('tr');
    
    row.appendChild(createCell(formatDate(match.card.date)));
    row.appendChild(createCell(formatDate(match.app.date)));
    row.appendChild(createCell(match.card.description));
    row.appendChild(createCell(match.app.description));
    row.appendChild(createCell(formatCurrency(match.card.amountInCents)));
    
    return row;
}

function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    
    row.appendChild(createCell(formatDate(transaction.date)));
    row.appendChild(createCell(transaction.description));
    row.appendChild(createCell(formatCurrency(transaction.amountInCents)));
    
    return row;
}

function createCell(content) {
    const cell = document.createElement('td');
    cell.textContent = content;
    return cell;
}

function createConfidenceCell(confidence) {
    const cell = document.createElement('td');
    cell.textContent = translateConfidence(confidence);
    cell.className = `confidence-${confidence}`;
    return cell;
}

function translateConfidence(confidence) {
    const translations = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa',
        unmatched: 'Não conciliado'
    };
    return translations[confidence] || confidence;
}

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

function formatCurrency(amountInCents) {
    const value = amountInCents / 100;
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
