# Fingenius

Aplicativo de controle financeiro pessoal que substitui a planilha de
orçamento familiar do Henry, implementando a regra de orçamento
**10 / 60 / 30** (Investimento / Despesas / Dívida).

## Stack

- **Framework:** Next.js (App Router) + React 18
- **Linguagem:** TypeScript (strict mode)
- **UI:** Tailwind CSS + componentes acessíveis no estilo shadcn/ui + ícones Lucide
- **Estado:** Zustand (pronto para uso global)
- **Utilitários de classe:** clsx + tailwind-merge + class-variance-authority

## Regras de negócio

1. **Entradas (Inflows):** fontes fixas — Grão, DLFelix, Kanastra, Outros.
2. **Dízimo:** subtraído do total de entradas para gerar a **Receita Líquida**.
3. **Regra de Orçamento (aplicada só sobre a Receita Líquida):**
   - Investimento: **10%**
   - Despesas: **60%**
   - Dívida: **30%**
   - Exibe comparativo **Meta vs. Realizado vs. Diferença**.
4. **Saídas (Outflows):** cada saída tem dia de vencimento, tipo
   (`investimento` | `despesas` | `divida`), descrição, valor e status
   (`ok` | `pendente`).
5. **Métricas do Dashboard:** Saldo Geral, Total Pago, Total Pendente e
   previsão de pagamentos agrupada por data de vencimento.

## Arquitetura (Feature-Sliced / Modular)

```
src/
├─ app/                         # App Router (layout, page, estilos globais)
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ ui/                       # Primitivos de UI (estilo shadcn/ui)
│     ├─ badge.tsx
│     ├─ card.tsx
│     ├─ progress.tsx
│     └─ table.tsx
├─ lib/
│  ├─ format.ts                 # Formatação BRL / percentuais / vencimento
│  └─ utils.ts                  # cn() — merge de classes Tailwind
└─ features/
   └─ finance/                  # Domínio financeiro
      ├─ types/
      │  └─ finance.types.ts    # Tipos: Transaction, Inflow, BudgetSummary...
      ├─ hooks/
      │  └─ useBudgetCalculations.ts  # Cálculos 10/60/30, totais e previsões
      ├─ data/
      │  └─ sample-budget.ts    # Dados de exemplo (Orçamento - Maio/2026)
      └─ components/
         ├─ Dashboard.tsx       # Composição principal
         ├─ SummaryCards.tsx    # Cards de métricas
         ├─ BudgetGoals.tsx     # Metas 10/60/30 (Progress + Badges)
         ├─ OutflowTable.tsx    # Tabela de saídas por vencimento
         └─ PaymentForecast.tsx # Previsão de pagamentos por data
```

Princípios: componentes de apresentação não fazem cálculo; toda a lógica
matemática do orçamento fica isolada em `useBudgetCalculations` e é
memoizada com `useMemo`.

## Scripts

```bash
npm install       # instala dependências
npm run dev       # ambiente de desenvolvimento (http://localhost:3000)
npm run build     # build de produção
npm run start     # serve o build de produção
npm run lint      # ESLint (next lint)
npm run typecheck # checagem de tipos (tsc --noEmit)
```