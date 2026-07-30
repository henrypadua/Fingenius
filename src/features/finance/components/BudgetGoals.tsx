import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  type BudgetGoal,
  TransactionType,
} from "@/features/finance/types/finance.types";
import { cn } from "@/lib/utils";

interface BudgetGoalsProps {
  goals: BudgetGoal[];
}

const TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.Investment]: "Investimento",
  [TransactionType.Expense]: "Despesas",
  [TransactionType.Debt]: "Dívida",
};

/** Visual comparison Meta vs. Realizado vs. Diferença for the 10/60/30 rule. */
export function BudgetGoals({ goals }: BudgetGoalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Regra de Orçamento 10 / 60 / 30
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Metas calculadas sobre a Receita Líquida.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const overBudget = goal.difference < 0;
          return (
            <div key={goal.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {TYPE_LABELS[goal.type]}
                  </span>
                  <Badge variant="outline">{formatPercent(goal.ratio)}</Badge>
                </div>
                <Badge variant={overBudget ? "destructive" : "success"}>
                  {overBudget ? "Acima da meta" : "Dentro da meta"}
                </Badge>
              </div>

              <Progress
                value={goal.progress * 100}
                indicatorClassName={cn(
                  overBudget ? "bg-destructive" : "bg-success",
                )}
              />

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Meta</span>
                  <p className="font-medium">{formatCurrency(goal.goal)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Realizado</span>
                  <p className="font-medium">{formatCurrency(goal.realized)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Diferença</span>
                  <p
                    className={cn(
                      "font-medium",
                      overBudget ? "text-destructive" : "text-success",
                    )}
                  >
                    {formatCurrency(goal.difference)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
