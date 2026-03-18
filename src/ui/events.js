export function setupEventListeners(onConsolidate) {
    setupMonthSelect();
    setupConsolidateButton(onConsolidate);
    setupToggleMatchedButton();
}

function setupMonthSelect() {
    const select = document.getElementById('month-select');
    const months = generateMonthOptions();
    
    populateSelect(select, months);
    attachSelectListener(select);
}

function generateMonthOptions() {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const value = formatMonthValue(date);
        const label = formatMonthLabel(date);
        
        options.push({ value, label });
    }
    
    return options;
}

function formatMonthValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function formatMonthLabel(date) {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${year}`;
}

function populateSelect(select, options) {
    for (const option of options) {
        const optionElement = createOption(option.value, option.label);
        select.appendChild(optionElement);
    }
}

function createOption(value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
}

function attachSelectListener(select) {
    select.addEventListener('change', handleSelectChange);
}

function handleSelectChange(event) {
    const hasValue = event.target.value !== '';
    toggleConsolidateButton(hasValue);
}

function toggleConsolidateButton(enabled) {
    const button = document.getElementById('consolidate-btn');
    button.disabled = !enabled;
}

function setupConsolidateButton(onConsolidate) {
    const button = document.getElementById('consolidate-btn');
    button.addEventListener('click', () => handleConsolidateClick(onConsolidate));
}

function handleConsolidateClick(onConsolidate) {
    const month = getSelectedMonth();
    
    if (month) {
        onConsolidate(month);
    }
}

function getSelectedMonth() {
    const select = document.getElementById('month-select');
    return select.value;
}

function setupToggleMatchedButton() {
    const button = document.getElementById('toggle-matched-btn');
    button.addEventListener('click', handleToggleMatched);
}

function handleToggleMatched() {
    const container = document.getElementById('matched-table-container');
    const button = document.getElementById('toggle-matched-btn');
    
    toggleTableVisibility(container, button);
}

function toggleTableVisibility(container, button) {
    const isCollapsed = container.classList.contains('collapsed');
    
    if (isCollapsed) {
        expandTable(container, button);
    } else {
        collapseTable(container, button);
    }
}

function expandTable(container, button) {
    container.classList.remove('collapsed');
    button.textContent = '▼ Recolher';
}

function collapseTable(container, button) {
    container.classList.add('collapsed');
    button.textContent = '▶ Expandir';
}
