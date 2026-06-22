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
    return text.split(/\r?\n/).filter(line => line.trim());
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
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
    }
    fields.push(current.trim());

    return fields;
}

function parseAmount(amountString) {
    const withoutThousands = amountString.replace(/\./g, '');
    const withDotDecimal = withoutThousands.replace(',', '.');
    const cleaned = withDotDecimal.replace(/[^\d.-]/g, '');
    const value = parseFloat(cleaned);
    return Math.round(value * 100);
}
