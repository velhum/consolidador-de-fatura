# Reconciliação Financeira

Aplicação web para reconciliação de transações financeiras entre cartão de crédito e aplicativo de controle financeiro.

## Estrutura do Projeto

```
/src
  /parsers
    csvParser.js       - Parser de arquivos CSV do cartão
    xlsParser.js       - Parser de arquivos XLS do app
  /domain
    normalizer.js      - Normalização de transações
    reconciliation.js  - Lógica de reconciliação
  /ui
    render.js          - Renderização de resultados
    events.js          - Gerenciamento de eventos
  main.js              - Ponto de entrada da aplicação
```

## Como Usar

1. Coloque os arquivos na pasta `/files/` com o formato `YYYY-MM.csv` e `YYYY-MM.xls`
2. Abra `index.html` em um navegador
3. Selecione o mês desejado
4. Clique em "Consolidar"

## Princípios de Clean Code Aplicados

### 1. Responsabilidade Única (SRP)

Cada módulo tem uma única responsabilidade bem definida:

- **Parsers**: Apenas leem e convertem arquivos em objetos Transaction
- **Normalizer**: Apenas padroniza dados (datas, valores, descrições)
- **Reconciliation**: Apenas executa a lógica de matching
- **Render**: Apenas exibe dados na tela
- **Events**: Apenas gerencia interações do usuário

### 2. Funções Pequenas e Descritivas

Todas as funções são pequenas (< 15 linhas) e fazem apenas uma coisa:

```javascript
// Exemplo: csvParser.js
function readFileAsText(file) { ... }
function splitIntoLines(text) { ... }
function removeHeader(lines) { ... }
function createCardTransaction(line) { ... }
```

### 3. Nomes Claros e Intencionais

Variáveis e funções têm nomes que revelam sua intenção:

- `normalizeDate()` em vez de `nd()`
- `calculateDaysDifference()` em vez de `diff()`
- `groupByAmount()` em vez de `group()`

### 4. Baixo Acoplamento

Os módulos não dependem uns dos outros diretamente:

- Parsers não conhecem o Normalizer
- Normalizer não conhece a Reconciliation
- Domain não conhece a UI
- UI não conhece o Domain

### 5. Separação de Responsabilidades

**Camada de Parsing** (`/parsers`):
- Responsável apenas por ler arquivos
- Retorna objetos Transaction padronizados
- Não contém lógica de negócio

**Camada de Domínio** (`/domain`):
- Contém toda a lógica de negócio
- Funções puras sem efeitos colaterais
- Independente da UI

**Camada de UI** (`/ui`):
- Apenas renderiza e captura eventos
- Não contém lógica de negócio
- Não manipula dados diretamente

### 6. Funções Puras

A maioria das funções são puras (sem efeitos colaterais):

```javascript
// Pura: sempre retorna o mesmo resultado para a mesma entrada
function normalizeDate(dateString) {
    const date = parseDate(dateString);
    return formatToIso(date);
}

// Pura: não modifica o array original
function normalizeTransactions(transactions) {
    return transactions.map(normalizeTransaction);
}
```

## Comunicação Entre Módulos

```
main.js (Orquestrador)
    ↓
    ├─→ parsers → Transaction[]
    ↓
    ├─→ normalizer → Transaction[] (normalized)
    ↓
    ├─→ reconciliation → MatchResult[]
    ↓
    └─→ ui/render → void (exibe na tela)
```

### Fluxo de Dados

1. **main.js** orquestra todo o fluxo
2. **parsers** leem arquivos e retornam `Transaction[]`
3. **normalizer** recebe `Transaction[]` e retorna `Transaction[]` normalizado
4. **reconciliation** recebe dois `Transaction[]` e retorna `MatchResult[]`
5. **render** recebe `MatchResult[]` e exibe na tela

### Onde Está a Regra de Negócio

A regra de negócio está **exclusivamente** em `/domain`:

**normalizer.js**:
- Conversão de datas para ISO
- Conversão de valores para centavos
- Normalização de descrições (lowercase, sem acentos, trim)

**reconciliation.js**:
- Agrupamento por valor usando `Map<number, Transaction[]>`
- Cálculo de confiança baseado em diferença de dias:
  - 0 dias = high
  - 1 dia = medium
  - 2 dias = low
  - Sem match = unmatched
- Seleção do melhor candidato quando há múltiplos matches
- Identificação de transações não conciliadas

## Vantagens da Arquitetura

1. **Testabilidade**: Cada função pode ser testada isoladamente
2. **Manutenibilidade**: Mudanças em uma camada não afetam outras
3. **Legibilidade**: Código auto-documentado com nomes claros
4. **Extensibilidade**: Fácil adicionar novos parsers ou regras
5. **Reutilização**: Funções pequenas podem ser reutilizadas

## Exemplo de Extensão

Para adicionar um novo tipo de arquivo (JSON):

1. Criar `src/parsers/jsonParser.js`
2. Implementar função que retorna `Transaction[]`
3. Importar e usar em `main.js`
4. **Não precisa modificar** domain ou UI

Para adicionar nova regra de matching:

1. Modificar apenas `src/domain/reconciliation.js`
2. Ajustar função `calculateConfidence()`
3. **Não precisa modificar** parsers ou UI
