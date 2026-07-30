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

## Deploy no GitHub Pages

O projeto está configurado para **exportação estática** (`output: "export"`)
e é publicado automaticamente via GitHub Actions.

1. No repositório, vá em **Settings → Pages** e defina **Source: GitHub Actions**.
2. Faça push para a branch `main` (ou rode o workflow manualmente em
   **Actions → Deploy to GitHub Pages → Run workflow**).
3. O site fica disponível em `https://<usuário>.github.io/Fingenius/`.

O workflow (`.github/workflows/deploy.yml`) injeta o `basePath` correto
(o nome do repositório) através da variável `NEXT_PUBLIC_BASE_PATH`, de forma
que os assets resolvam corretamente na URL do projeto. Localmente, sem essa
variável, o app roda a partir da raiz (`/`).