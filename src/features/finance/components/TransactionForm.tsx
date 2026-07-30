"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TRANSACTION_TYPE_OPTIONS } from "@/features/finance/constants";
import type { TransactionDraft } from "@/features/finance/store/useBudgetStore";
import {
  type TransactionStatus,
  TransactionType,
} from "@/features/finance/types/finance.types";

interface TransactionFormProps {
  /** Called with a validated draft when the user submits. */
  onSubmit: (draft: TransactionDraft) => void;
}

const EMPTY = {
  description: "",
  amount: "",
  dueDay: "",
};

/**
 * TransactionForm — records a new outflow (saída): despesa, dívida or
 * investimento. It stays presentation-only: validation lives here, but
 * persistence is delegated to the caller via `onSubmit`.
 */
export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = React.useState<TransactionType>(
    TransactionType.Expense,
  );
  const [status, setStatus] = React.useState<TransactionStatus>("pendente");
  const [values, setValues] = React.useState(EMPTY);
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const description = values.description.trim();
    const amount = Number(values.amount);
    const dueDay = Number(values.dueDay);

    if (!description) {
      setError("Informe uma descrição.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }
    if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
      setError("O dia de vencimento deve estar entre 1 e 31.");
      return;
    }

    onSubmit({ description, amount, dueDay, type, status });
    setValues(EMPTY);
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="tx-description">Descrição</Label>
        <Input
          id="tx-description"
          placeholder="Ex.: Energia, Cartões, Aporte..."
          value={values.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tx-type">Tipo</Label>
          <Select
            id="tx-type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as TransactionType)
            }
          >
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tx-amount">Valor (R$)</Label>
          <Input
            id="tx-amount"
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

        <div className="space-y-1.5">
          <Label htmlFor="tx-dueDay">Dia de vencimento</Label>
          <Input
            id="tx-dueDay"
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            placeholder="1 a 31"
            value={values.dueDay}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, dueDay: event.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tx-status">Status</Label>
          <Select
            id="tx-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TransactionStatus)
            }
          >
            <option value="pendente">Pendente</option>
            <option value="ok">Pago</option>
          </Select>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto">
        Adicionar saída
      </Button>
    </form>
  );
}
