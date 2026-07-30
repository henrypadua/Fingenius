"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AppNav } from "@/features/finance/components/AppNav";
import { InflowForm } from "@/features/finance/components/InflowForm";
import { TransactionForm } from "@/features/finance/components/TransactionForm";
import { TRANSACTION_TYPE_LABELS } from "@/features/finance/constants";
import { useBudgetStore } from "@/features/finance/store/useBudgetStore";
import { useHasHydrated } from "@/features/finance/hooks/useHasHydrated";
import { formatCurrency, formatDueDay } from "@/lib/format";
import { Trash2, RotateCcw } from "lucide-react";

/**
 * LaunchScreen — the "Lançamentos" screen.
 *
 * This is where the user records every entrada (receita) and saída
 * (despesa / dívida / investimento). Everything written here lands in the
 * shared budget store and is what feeds the Dashboard, enabling the monthly
 * control and 10/60/30 planning.
 */
export function LaunchScreen() {
  const hydrated = useHasHydrated();
  const budget = useBudgetStore((state) => state.budget);
  const setReference = useBudgetStore((state) => state.setReference);
  const setTithe = useBudgetStore((state) => state.setTithe);
  const addInflow = useBudgetStore((state) => state.addInflow);
  const removeInflow = useBudgetStore((state) => state.removeInflow);
  const addTransaction = useBudgetStore((state) => state.addTransaction);
  const removeTransaction = useBudgetStore((state) => state.removeTransaction);
  const toggleTransactionStatus = useBudgetStore(
    (state) => state.toggleTransactionStatus,
  );
  const resetToSample = useBudgetStore((state) => state.resetToSample);
  const clearAll = useBudgetStore((state) => state.clearAll);

  const grossIncome = budget.inflows.reduce((acc, i) => acc + i.amount, 0);
  const netIncome = grossIncome - budget.tithe;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lançamentos</h1>
          <p className="text-sm text-muted-foreground">
            Registre entradas e saídas para alimentar o painel.
          </p>
        </div>
        <AppNav />
      </header>

      {/* Period + tithe settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Período
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Referência do mês e dízimo aplicado sobre a receita bruta.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="reference">Referência</Label>
            <Input
              id="reference"
              placeholder="Ex.: Maio (2026)"
              value={budget.reference}
              onChange={(event) => setReference(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tithe">Dízimo (R$)</Label>
            <Input
              id="tithe"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={String(budget.tithe)}
              onChange={(event) => setTithe(Number(event.target.value))}
            />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Receita bruta {formatCurrency(grossIncome)} · Dízimo{" "}
            {formatCurrency(budget.tithe)} · Receita líquida{" "}
            {formatCurrency(netIncome)}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Entradas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Entradas
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Receitas que compõem a renda do mês.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <InflowForm onSubmit={(draft) => addInflow(draft)} />
            <ul className="space-y-2">
              {!hydrated ? null : budget.inflows.length === 0 ? (
                <li className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
                  Nenhuma entrada registrada.
                </li>
              ) : (
                budget.inflows.map((inflow) => (
                  <li
                    key={inflow.id}
                    className="flex items-center justify-between gap-3 rounded-md border p-3"
                  >
                    <span className="text-sm font-medium">{inflow.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {formatCurrency(inflow.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover ${inflow.source}`}
                        onClick={() => removeInflow(inflow.id)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Saídas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Saídas
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Despesas, dívidas e investimentos (regra 10 / 60 / 30).
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <TransactionForm onSubmit={(draft) => addTransaction(draft)} />
            <ul className="space-y-2">
              {!hydrated ? null : budget.transactions.length === 0 ? (
                <li className="rounded-md border border-dashed p-3 text-center text-sm text-muted-foreground">
                  Nenhuma saída registrada.
                </li>
              ) : (
                [...budget.transactions]
                  .sort((a, b) => a.dueDay - b.dueDay)
                  .map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDueDay(tx.dueDay)} ·{" "}
                          {TRANSACTION_TYPE_LABELS[tx.type]}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-semibold">
                          {formatCurrency(tx.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleTransactionStatus(tx.id)}
                          aria-label={`Alternar status de ${tx.description}`}
                        >
                          <Badge
                            variant={tx.status === "ok" ? "success" : "warning"}
                          >
                            {tx.status === "ok" ? "Pago" : "Pendente"}
                          </Badge>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover ${tx.description}`}
                          onClick={() => removeTransaction(tx.id)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => resetToSample()}>
          <RotateCcw />
          Restaurar exemplo
        </Button>
        <Button variant="outline" onClick={() => clearAll()}>
          <Trash2 />
          Limpar tudo
        </Button>
      </div>
    </main>
  );
}
