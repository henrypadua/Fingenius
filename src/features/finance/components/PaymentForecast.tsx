import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDueDay } from "@/lib/format";
import type { PaymentForecastGroup } from "@/features/finance/types/finance.types";
import { CalendarClock } from "lucide-react";

interface PaymentForecastProps {
  forecast: PaymentForecastGroup[];
}

/** Payments grouped by due day, e.g. "Vencimento no dia 05". */
export function PaymentForecast({ forecast }: PaymentForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Previsão de Pagamentos
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Agrupados por data de vencimento.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {forecast.map((group) => (
          <div
            key={group.dueDay}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <CalendarClock
                className="h-4 w-4 text-muted-foreground"
                aria-hidden
              />
              <div>
                <p className="text-sm font-medium">
                  Vencimento no {formatDueDay(group.dueDay)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {group.transactions.length}{" "}
                  {group.transactions.length === 1 ? "pagamento" : "pagamentos"}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold">
              {formatCurrency(group.total)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
