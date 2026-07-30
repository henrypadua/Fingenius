import { TransactionType } from "@/features/finance/types/finance.types";

/** Human-readable labels for each budget bucket (pt-BR). */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.Investment]: "Investimento",
  [TransactionType.Expense]: "Despesa",
  [TransactionType.Debt]: "Dívida",
};

/** Ordered options for transaction-type selects, aligned with 10/60/30. */
export const TRANSACTION_TYPE_OPTIONS: ReadonlyArray<{
  value: TransactionType;
  label: string;
}> = [
  { value: TransactionType.Expense, label: TRANSACTION_TYPE_LABELS.despesas },
  {
    value: TransactionType.Investment,
    label: TRANSACTION_TYPE_LABELS.investimento,
  },
  { value: TransactionType.Debt, label: TRANSACTION_TYPE_LABELS.divida },
];
