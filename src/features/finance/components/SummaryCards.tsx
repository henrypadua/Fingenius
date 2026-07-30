import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { BudgetSummary } from "@/features/finance/types/finance.types";
import { cn } from "@/lib/utils";
import { Wallet, CheckCircle2, Clock, Landmark } from "lucide-react";

interface SummaryCardsProps {
  summary: BudgetSummary;
}

/**
 * Presentation-only top metrics row. No calculations happen here —
 * everything arrives pre-computed via `summary`.
 */
export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Saldo Geral",
      value: summary.balance,
      icon: Wallet,
      hint: "Entradas − Saídas",
      valueClass: summary.balance >= 0 ? "text-success" : "text-destructive",
    },
    {
      title: "Receita Líquida",
      value: summary.netIncome,
      icon: Landmark,
      hint: "Entradas − Dízimo",
      valueClass: "text-foreground",
    },
    {
      title: "Total Pago",
      value: summary.totalPaid,
      icon: CheckCircle2,
      hint: "Saídas com status OK",
      valueClass: "text-success",
    },
    {
      title: "Total Pendente",
      value: summary.totalPending,
      icon: Clock,
      hint: "Saídas em aberto",
      valueClass: "text-warning",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", card.valueClass)}>
                {formatCurrency(card.value)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
