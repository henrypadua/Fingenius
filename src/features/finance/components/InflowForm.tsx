"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InflowDraft } from "@/features/finance/store/useBudgetStore";

interface InflowFormProps {
  /** Called with a validated draft when the user submits. */
  onSubmit: (draft: InflowDraft) => void;
}

const EMPTY = { source: "", amount: "" };

/**
 * InflowForm — records a new inflow (entrada / receita) that raises the
 * gross income. Validation happens here; persistence is delegated to the
 * caller via `onSubmit`.
 */
export function InflowForm({ onSubmit }: InflowFormProps) {
  const [values, setValues] = React.useState(EMPTY);
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const source = values.source.trim();
    const amount = Number(values.amount);

    if (!source) {
      setError("Informe a fonte da receita.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    onSubmit({ source, amount });
    setValues(EMPTY);
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="in-source">Fonte</Label>
          <Input
            id="in-source"
            placeholder="Ex.: Salário, Freelance..."
            value={values.source}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, source: event.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="in-amount">Valor (R$)</Label>
          <Input
            id="in-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={values.amount}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, amount: event.target.value }))
            }
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto">
        Adicionar entrada
      </Button>
    </form>
  );
}
