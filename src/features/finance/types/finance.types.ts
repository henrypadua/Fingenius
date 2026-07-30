/**
 * finance.types.ts
 * ------------------------------------------------------------------
 * Domain types for Fingenius — personal finance control.
 *
 * Business rules encoded here (from the original "Orçamento" spreadsheet):
 *  - Inflows generate a Gross income.
 *  - A "Dízimo" (tithe) is subtracted from the Gross income to produce
 *    the Net income (Receita Líquida).
 *  - The 10/60/30 budget rule is applied ONLY over the Net income:
 *      Investimento = 10%, Despesas = 60%, Dívida = 30%.
 *
 * `any` is intentionally forbidden across the codebase.
 */

/** Category of a realized outflow, aligned with the 10/60/30 rule. */
export enum TransactionType {
  Investment = "investimento",
  Expense = "despesas",
  Debt = "divida",
}

/** Payment status of a realized outflow. */
export type TransactionStatus = "ok" | "pendente";

/** A fixed income source (e.g. Grão, DLFelix, Kanastra, Outros). */
export interface Inflow {
  id: string;
  /** Human readable source name. */
  source: string;
  /** Monetary amount for the period. */
  amount: number;
}

/** A realized outflow / expense line. */
export interface Transaction {
  id: string;
  /** Day of month the payment is due (1-31). */
  dueDay: number;
  /** Which budget bucket this outflow belongs to. */
  type: TransactionType;
  /** Free-text description. */
  description: string;
  /** Monetary amount. */
  amount: number;
  /** Whether it has been paid ("ok") or is still pending. */
  status: TransactionStatus;
}

/**
 * The raw monthly budget input: everything the user provides.
 * All derived values (net income, goals, totals) are computed, never stored.
 */
export interface MonthlyBudget {
  /** Reference label, e.g. "Maio (2026)". */
  reference: string;
  /** Fixed income sources. */
  inflows: Inflow[];
  /** The tithe amount to subtract from gross income. */
  tithe: number;
  /** Realized outflows. */
  transactions: Transaction[];
}

/** The 10/60/30 allocation ratios. */
export interface BudgetRuleRatios {
  investment: number;
  expense: number;
  debt: number;
}

/** Goal vs. realized comparison for a single budget bucket. */
export interface BudgetGoal {
  type: TransactionType;
  /** Percentage of net income allocated to this bucket (e.g. 0.1). */
  ratio: number;
  /** Target amount = ratio * netIncome. */
  goal: number;
  /** Sum of realized transactions of this type. */
  realized: number;
  /** goal - realized. Positive = under budget, negative = over budget. */
  difference: number;
  /** realized / goal, clamped to [0, 1] for progress bars. */
  progress: number;
}

/** A group of payments sharing the same due day. */
export interface PaymentForecastGroup {
  dueDay: number;
  total: number;
  transactions: Transaction[];
}

/** Fully derived summary consumed by the presentation layer. */
export interface BudgetSummary {
  /** Sum of all inflows. */
  grossIncome: number;
  /** grossIncome - tithe. Budget rule applies over this value. */
  netIncome: number;
  /** Sum of all outflows regardless of status. */
  totalOutflows: number;
  /** grossIncome - totalOutflows. */
  balance: number;
  /** Sum of outflows with status === "ok". */
  totalPaid: number;
  /** Sum of outflows with status === "pendente". */
  totalPending: number;
  /** 10/60/30 goals with realized/difference per bucket. */
  goals: BudgetGoal[];
  /** Outflows grouped by due day, ascending. */
  forecast: PaymentForecastGroup[];
}
