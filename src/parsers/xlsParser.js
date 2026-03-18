export async function parseAppXls(file) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const workbook = parseWorkbook(arrayBuffer);
    const worksheet = getFirstWorksheet(workbook);
    const rows = extractRows(worksheet);
    const dataRows = removeHeader(rows);
    
    return dataRows.map(createAppTransaction);
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function parseWorkbook(arrayBuffer) {
    return XLSX.read(arrayBuffer, { type: 'array' });
}

function getFirstWorksheet(workbook) {
    const sheetName = workbook.SheetNames[0];
    return workbook.Sheets[sheetName];
}

function extractRows(worksheet) {
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}

function removeHeader(rows) {
    return rows.slice(1).filter(row => row.length > 0);
}

function createAppTransaction(row) {
    const [date, description, amount] = row;
    
    return {
        source: 'app',
        date: String(date),
        description: String(description),
        amountInCents: parseAmount(amount)
    };
}

function parseAmount(value) {
    if (typeof value === 'number') {
        return Math.round(value * -100);
    }
    
    const cleaned = String(value).replace(/[^\d,-]/g, '');
    const normalized = cleaned.replace(',', '.');
    const numValue = parseFloat(normalized);
    return Math.round(numValue * -100);
}
