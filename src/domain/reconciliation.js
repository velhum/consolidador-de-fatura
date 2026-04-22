export function reconcile(cardTransactions, appTransactions) {
    const cardByAmount = groupByAmount(cardTransactions);
    const appByAmount = groupByAmount(appTransactions);
    
    const matchResults = matchTransactions(cardByAmount, appByAmount);
    
    return matchResults;
}

function groupByAmount(transactions) {
    const grouped = new Map();
    
    for (const transaction of transactions) {
        const amount = transaction.amountInCents;
        
        if (!grouped.has(amount)) {
            grouped.set(amount, []);
        }
        
        grouped.get(amount).push(transaction);
    }
    
    return grouped;
}

function matchTransactions(cardByAmount, appByAmount) {
    const results = [];
    const matchedAppTxs = new Set();
    
    for (const [amount, cardTxs] of cardByAmount) {
        const appTxs = appByAmount.get(amount) || [];
        
        for (const cardTx of cardTxs) {
            const availableAppTxs = filterUnmatched(appTxs, matchedAppTxs);
            const match = findBestMatch(cardTx, availableAppTxs);
            
            if (match.app) {
                matchedAppTxs.add(match.app);
            }
            
            results.push(match);
        }
    }
    
    const unmatchedApp = findUnmatchedAppTransactions(appByAmount, matchedAppTxs);
    results.push(...unmatchedApp);
    
    return results;
}

function filterUnmatched(transactions, matchedTxs) {
    return transactions.filter(tx => !matchedTxs.has(tx));
}

function createTransactionId(transaction) {
    return `${transaction.source}-${transaction.date}-${transaction.amountInCents}-${transaction.description}`;
}

function findBestMatch(cardTx, appTxs) {
    if (appTxs.length === 0) {
        return createUnmatchedResult(cardTx);
    }
    
    const candidates = appTxs.map(appTx => ({
        app: appTx,
        confidence: calculateConfidence(cardTx, appTx)
    }));
    
    const bestCandidate = selectBestCandidate(candidates);
    
    return {
        card: cardTx,
        app: bestCandidate.app,
        confidence: bestCandidate.confidence
    };
}

function createUnmatchedResult(cardTx) {
    return {
        card: cardTx,
        app: null,
        confidence: 'unmatched'
    };
}

function calculateConfidence(cardTx, appTx) {
    const daysDiff = calculateDaysDifference(cardTx.date, appTx.date);
    
    if (daysDiff === 0) {
        return 'high';
    }
    
    if (daysDiff === 1) {
        return 'medium';
    }
    
    if (daysDiff === 2) {
        return 'low';
    }
    
    return 'unmatched';
}

function calculateDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d1 - d2);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
}

function selectBestCandidate(candidates) {
    const confidenceOrder = { high: 3, medium: 2, low: 1, unmatched: 0 };
    
    return candidates.reduce((best, current) => {
        const bestScore = confidenceOrder[best.confidence];
        const currentScore = confidenceOrder[current.confidence];
        
        return currentScore > bestScore ? current : best;
    });
}

function findUnmatchedAppTransactions(appByAmount, matchedTxs) {
    const unmatched = [];
    
    for (const appTxs of appByAmount.values()) {
        for (const appTx of appTxs) {
            if (!matchedTxs.has(appTx)) {
                unmatched.push({
                    card: null,
                    app: appTx,
                    confidence: 'unmatched'
                });
            }
        }
    }
    
    return unmatched;
}
