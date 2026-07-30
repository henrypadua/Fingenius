import {
  type MonthlyBudget,
  TransactionType,
} from "@/features/finance/types/finance.types";

/**
 * Sample monthly budget mirroring the structure of the original
 * "Orçamento - Maio(2026)" spreadsheet. Values are illustrative.
 */
export const sampleBudget: MonthlyBudget = {
  reference: "Maio (2026)",
  inflows: [
    { id: "in-grao", source: "Grão", amount: 6500 },
    { id: "in-dlfelix", source: "DLFelix", amount: 3200 },
    { id: "in-kanastra", source: "Kanastra", amount: 1800 },
    { id: "in-outros", source: "Outros", amount: 500 },
  ],
  tithe: 1200,
  transactions: [
    {
      id: "tx-invest-aporte",
      dueDay: 5,
      type: TransactionType.Investment,
      description: "Aporte mensal",
      amount: 900,
      status: "ok",
    },
    {
      id: "tx-exp-energia",
      dueDay: 5,
      type: TransactionType.Expense,
      description: "Energia",
      amount: 420,
      status: "ok",
    },
    {
      id: "tx-exp-marmitas",
      dueDay: 10,
      type: TransactionType.Expense,
      description: "Marmitas",
      amount: 780,
      status: "pendente",
    },
    {
      id: "tx-exp-contador",
      dueDay: 10,
      type: TransactionType.Expense,
      description: "Contador",
      amount: 350,
      status: "ok",
    },
    {
      id: "tx-exp-cartoes",
      dueDay: 15,
      type: TransactionType.Expense,
      description: "Cartões",
      amount: 2100,
      status: "pendente",
    },
    {
      id: "tx-debt-emprestimo",
      dueDay: 20,
      type: TransactionType.Debt,
      description: "Empréstimo",
      amount: 1500,
      status: "pendente",
    },
    {
      id: "tx-debt-financiamento",
      dueDay: 25,
      type: TransactionType.Debt,
      description: "Financiamento",
      amount: 1300,
      status: "ok",
    },
  ],
};
