export function normalizeTransaction(transaction) {
    return {
        ...transaction,
        date: normalizeDate(transaction.date),
        description: normalizeDescription(transaction.description)
    };
}

export function normalizeTransactions(transactions) {
    return transactions.map(normalizeTransaction);
}

function normalizeDate(dateString) {
    const date = parseDate(dateString);
    return formatToIso(date);
}

function parseDate(dateString) {
    if (dateString.includes('/')) {
        return parseBrazilianDate(dateString);
    }
    return new Date(dateString);
}

function parseBrazilianDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

function formatToIso(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function normalizeDescription(description) {
    const lowercased = toLowerCase(description);
    const withoutAccents = removeAccents(lowercased);
    return trim(withoutAccents);
}

function toLowerCase(text) {
    return text.toLowerCase();
}

function removeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function trim(text) {
    return text.trim();
}
