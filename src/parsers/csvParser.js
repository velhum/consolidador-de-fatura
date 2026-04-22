export async function parseCardCsv(file) {
    const text = await readFileAsText(file);
    const lines = splitIntoLines(text);
    const dataLines = removeHeader(lines);
    
    return dataLines.map(createCardTransaction);
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function splitIntoLines(text) {
    return text.split('\n').filter(line => line.trim());
}

function removeHeader(lines) {
    return lines.slice(1);
}

function createCardTransaction(line) {
    const [date, description, amount] = parseCsvLine(line);
    
    return {
        source: 'card',
        date,
        description,
        amountInCents: parseAmount(amount)
    };
}

function parseCsvLine(line) {
    const parts = line.split(',');
    return parts.map(part => part.trim());
}

function parseAmount(amountString) {
    const cleaned = amountString.replace(/[^\d.-]/g, '');
    const value = parseFloat(cleaned);
    return Math.round(value * 100);
}
