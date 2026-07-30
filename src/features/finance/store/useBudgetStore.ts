"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Inflow,
  type MonthlyBudget,
  type Transaction,
} from "@/features/finance/types/finance.types";
import { sampleBudget } from "@/features/finance/data/sample-budget";

/**
 * useBudgetStore
 * ------------------------------------------------------------------
 * Client-side single source of truth for the monthly budget.
 *
 * The app is a fully static export (no backend), so every "lançamento"
 * (entry) the user records lives here and is persisted to `localStorage`.
 * The Dashboard reads derived numbers from this same budget, which is how
 * the launch screens feed the dashboard.
 *
 * Inputs coming from forms never include an `id`; the store owns identity
 * generation so callers stay dumb. `any` is intentionally forbidden.
 */

/** Draft of an inflow as provided by a form (identity is store-owned). */
export type InflowDraft = Omit<Inflow, "id">;

/** Draft of a transaction as provided by a form (identity is store-owned). */
export type TransactionDraft = Omit<Transaction, "id">;

export interface BudgetState {
  /** The raw monthly budget that feeds every derived view. */
  budget: MonthlyBudget;

  /** Update the reference label, e.g. "Maio (2026)". */
  setReference: (reference: string) => void;
  /** Update the tithe subtracted from gross income. */
  setTithe: (tithe: number) => void;

  /** Add a new inflow (entrada / receita). Returns the generated id. */
  addInflow: (draft: InflowDraft) => string;
  /** Patch an existing inflow by id. */
  updateInflow: (id: string, patch: Partial<InflowDraft>) => void;
  /** Remove an inflow by id. */
  removeInflow: (id: string) => void;

  /** Add a new outflow (saída: despesa / dívida / investimento). */
  addTransaction: (draft: TransactionDraft) => string;
  /** Patch an existing transaction by id. */
  updateTransaction: (id: string, patch: Partial<TransactionDraft>) => void;
  /** Toggle a transaction between "ok" and "pendente". */
  toggleTransactionStatus: (id: string) => void;
  /** Remove a transaction by id. */
  removeTransaction: (id: string) => void;

  /** Restore the illustrative sample budget. */
  resetToSample: () => void;
  /** Clear every inflow and transaction, keeping the reference. */
  clearAll: () => void;
}

/** Generates a collision-resistant id, with a fallback for old runtimes. */
function createId(prefix: string): string {
  const globalCrypto =
    typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  const unique =
    globalCrypto && typeof globalCrypto.randomUUID === "function"
      ? globalCrypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${unique}`;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budget: sampleBudget,

      setReference: (reference) =>
        set((state) => ({ budget: { ...state.budget, reference } })),

      setTithe: (tithe) =>
        set((state) => ({
          budget: { ...state.budget, tithe: Math.max(tithe, 0) },
        })),

      addInflow: (draft) => {
        const id = createId("in");
        set((state) => ({
          budget: {
            ...state.budget,
            inflows: [...state.budget.inflows, { ...draft, id }],
          },
        }));
        return id;
      },

      updateInflow: (id, patch) =>
        set((state) => ({
          budget: {
            ...state.budget,
            inflows: state.budget.inflows.map((inflow) =>
              inflow.id === id ? { ...inflow, ...patch } : inflow,
            ),
          },
        })),

      removeInflow: (id) =>
        set((state) => ({
          budget: {
            ...state.budget,
            inflows: state.budget.inflows.filter((inflow) => inflow.id !== id),
          },
        })),

      addTransaction: (draft) => {
        const id = createId("tx");
        set((state) => ({
          budget: {
            ...state.budget,
            transactions: [...state.budget.transactions, { ...draft, id }],
          },
        }));
        return id;
      },

      updateTransaction: (id, patch) =>
        set((state) => ({
          budget: {
            ...state.budget,
            transactions: state.budget.transactions.map((transaction) =>
              transaction.id === id
                ? { ...transaction, ...patch }
                : transaction,
            ),
          },
        })),

      toggleTransactionStatus: (id) =>
        set((state) => ({
          budget: {
            ...state.budget,
            transactions: state.budget.transactions.map((transaction) =>
              transaction.id === id
                ? {
                    ...transaction,
                    status: transaction.status === "ok" ? "pendente" : "ok",
                  }
                : transaction,
            ),
          },
        })),

      removeTransaction: (id) =>
        set((state) => ({
          budget: {
            ...state.budget,
            transactions: state.budget.transactions.filter(
              (transaction) => transaction.id !== id,
            ),
          },
        })),

      resetToSample: () => set({ budget: sampleBudget }),

      clearAll: () =>
        set((state) => ({
          budget: { ...state.budget, inflows: [], transactions: [] },
        })),
    }),
    {
      name: "fingenius-budget",
      version: 1,
      // Rehydration is triggered manually after mount (see useHasHydrated)
      // so the first client render matches the static HTML and avoids
      // hydration mismatches.
      skipHydration: true,
    },
  ),
);
