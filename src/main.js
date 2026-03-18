import { parseCardCsv } from './parsers/csvParser.js';
import { parseAppXls } from './parsers/xlsParser.js';
import { normalizeTransactions } from './domain/normalizer.js';
import { reconcile } from './domain/reconciliation.js';
import { setupEventListeners } from './ui/events.js';
import { renderResults, showLoading, hideLoading } from './ui/render.js';

function initialize() {
    loadExternalLibraries();
    setupEventListeners(handleConsolidate);
}

function loadExternalLibraries() {
    loadXlsxLibrary();
}

function loadXlsxLibrary() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    document.head.appendChild(script);
}

async function handleConsolidate(month) {
    showLoading();
    
    try {
        const files = await loadFiles(month);
        const transactions = await parseFiles(files);
        const normalized = normalizeAllTransactions(transactions);
        const matchResults = reconcileTransactions(normalized);
        
        renderResults(matchResults);
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

async function loadFiles(month) {
    const csvFile = await fetchFile(`./files/${month}.csv`);
    const xlsFile = await fetchFile(`./files/${month}.xls`);
    
    return { csvFile, xlsFile };
}

async function fetchFile(path) {
    const response = await fetch(path);
    
    if (!response.ok) {
        throw new Error(`Arquivo não encontrado: ${path}`);
    }
    
    const blob = await response.blob();
    return createFile(blob, path);
}

function createFile(blob, path) {
    const filename = extractFilename(path);
    return new File([blob], filename);
}

function extractFilename(path) {
    return path.split('/').pop();
}

async function parseFiles(files) {
    const cardTransactions = await parseCardCsv(files.csvFile);
    const appTransactions = await parseAppXls(files.xlsFile);
    
    return { cardTransactions, appTransactions };
}

function normalizeAllTransactions(transactions) {
    return {
        cardTransactions: normalizeTransactions(transactions.cardTransactions),
        appTransactions: normalizeTransactions(transactions.appTransactions)
    };
}

function reconcileTransactions(normalized) {
    return reconcile(normalized.cardTransactions, normalized.appTransactions);
}

function handleError(error) {
    console.error('Erro ao processar:', error);
    alert(`Erro: ${error.message}`);
}

document.addEventListener('DOMContentLoaded', initialize);
