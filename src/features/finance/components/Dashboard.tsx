"use client";

import { useBudgetCalculations } from "@/features/finance/hooks/useBudgetCalculations";
import type { MonthlyBudget } from "@/features/finance/types/finance.types";
import { SummaryCards } from "@/features/finance/components/SummaryCards";
import { BudgetGoals } from "@/features/finance/components/BudgetGoals";
import { OutflowTable } from "@/features/finance/components/OutflowTable";
import { PaymentForecast } from "@/features/finance/components/PaymentForecast";
import { AppNav } from "@/features/finance/components/AppNav";
import { formatCurrency } from "@/lib/format";

interface DashboardProps {
  budget: MonthlyBudget;
}

/**
 * Dashboard — the composition root of the finance view.
 *
 * It delegates all math to `useBudgetCalculations` and only wires the
 * derived summary into presentation components (SOLID / dumb UI).
 */
export function Dashboard({ budget }: DashboardProps) {
  const summary = useBudgetCalculations(budget);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Fingenius</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              {budget.reference}
            </span>
            <AppNav />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Entradas {formatCurrency(summary.grossIncome)} · Dízimo{" "}
          {formatCurrency(budget.tithe)} · Receita Líquida{" "}
          {formatCurrency(summary.netIncome)}
        </p>
      </header>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BudgetGoals goals={summary.goals} />
        <PaymentForecast forecast={summary.forecast} />
      </div>

      <OutflowTable transactions={budget.transactions} />
    </main>
  );
}
