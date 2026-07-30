"use client";

import { useMemo } from "react";
import {
  type BudgetGoal,
  type BudgetRuleRatios,
  type BudgetSummary,
  type MonthlyBudget,
  type PaymentForecastGroup,
  type Transaction,
  TransactionType,
} from "@/features/finance/types/finance.types";

/** Default 10/60/30 rule ratios. Kept explicit so they can be overridden. */
export const DEFAULT_BUDGET_RATIOS: BudgetRuleRatios = {
  investment: 0.1,
  expense: 0.6,
  debt: 0.3,
};

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

function ratioForType(type: TransactionType, ratios: BudgetRuleRatios): number {
  switch (type) {
    case TransactionType.Investment:
      return ratios.investment;
    case TransactionType.Expense:
      return ratios.expense;
    case TransactionType.Debt:
      return ratios.debt;
    default: {
      // Exhaustiveness guard — will fail to compile if a new type is added.
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

function buildGoals(
  netIncome: number,
  transactions: Transaction[],
  ratios: BudgetRuleRatios,
): BudgetGoal[] {
  const orderedTypes: TransactionType[] = [
    TransactionType.Investment,
    TransactionType.Expense,
    TransactionType.Debt,
  ];

  return orderedTypes.map((type) => {
    const ratio = ratioForType(type, ratios);
    const goal = netIncome * ratio;
    const realized = sum(
      transactions.filter((t) => t.type === type).map((t) => t.amount),
    );
    const difference = goal - realized;
    const progress = goal > 0 ? Math.min(realized / goal, 1) : 0;

    return { type, ratio, goal, realized, difference, progress };
  });
}

function buildForecast(transactions: Transaction[]): PaymentForecastGroup[] {
  const groups = new Map<number, Transaction[]>();

  for (const transaction of transactions) {
    const existing = groups.get(transaction.dueDay);
    if (existing) {
      existing.push(transaction);
    } else {
      groups.set(transaction.dueDay, [transaction]);
    }
  }

  return Array.from(groups.entries())
    .map(([dueDay, items]) => ({
      dueDay,
      total: sum(items.map((t) => t.amount)),
      transactions: items,
    }))
    .sort((a, b) => a.dueDay - b.dueDay);
}

/**
 * useBudgetCalculations
 * ------------------------------------------------------------------
 * Isolates every budget math concern (SOLID: presentation stays dumb).
 *
 * All heavy aggregations are memoized against the budget input and the
 * rule ratios, so growing the transaction list does not trigger
 * recalculation on unrelated re-renders.
 */
export function useBudgetCalculations(
  budget: MonthlyBudget,
  ratios: BudgetRuleRatios = DEFAULT_BUDGET_RATIOS,
): BudgetSummary {
  const { inflows, tithe, transactions } = budget;

  return useMemo<BudgetSummary>(() => {
    const grossIncome = sum(inflows.map((i) => i.amount));
    const netIncome = grossIncome - tithe;

    const totalOutflows = sum(transactions.map((t) => t.amount));
    const totalPaid = sum(
      transactions.filter((t) => t.status === "ok").map((t) => t.amount),
    );
    const totalPending = sum(
      transactions.filter((t) => t.status === "pendente").map((t) => t.amount),
    );

    const balance = grossIncome - totalOutflows;

    return {
      grossIncome,
      netIncome,
      totalOutflows,
      balance,
      totalPaid,
      totalPending,
      goals: buildGoals(netIncome, transactions, ratios),
      forecast: buildForecast(transactions),
    };
  }, [inflows, tithe, transactions, ratios]);
}
