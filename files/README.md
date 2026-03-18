# Arquivos de Teste

Esta pasta deve conter os arquivos CSV e XLS para reconciliação.

## Formato dos Arquivos

### CSV (Cartão)
```
Data,Descrição,Valor
15/03/2024,Supermercado ABC,R$ 150,00
```

### XLS (Minhas Economias)
Planilha Excel com colunas:
- Data
- Descrição
- Valor

## Nomenclatura

Os arquivos devem seguir o padrão:
- `YYYY-MM.csv` (ex: 2024-03.csv)
- `YYYY-MM.xls` (ex: 2024-03.xls)

## Nota sobre XLS

Para criar um arquivo XLS de teste, você pode:
1. Criar uma planilha no Excel/LibreOffice
2. Adicionar as colunas: Data, Descrição, Valor
3. Salvar como formato XLS (Excel 97-2003)

Exemplo de dados para o XLS:
```
Data          | Descrição              | Valor
15/03/2024    | Supermercado ABC       | 150.00
17/03/2024    | Farmácia XYZ           | 45.50
18/03/2024    | Restaurante Italiano   | 89.90
```
