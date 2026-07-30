import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDueDay } from "@/lib/format";
import {
  type Transaction,
  TransactionType,
} from "@/features/finance/types/finance.types";

interface OutflowTableProps {
  transactions: Transaction[];
}

const TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.Investment]: "Investimento",
  [TransactionType.Expense]: "Despesas",
  [TransactionType.Debt]: "Dívida",
};

const TYPE_VARIANT: Record<
  TransactionType,
  "default" | "secondary" | "outline"
> = {
  [TransactionType.Investment]: "default",
  [TransactionType.Expense]: "secondary",
  [TransactionType.Debt]: "outline",
};

/** Clean table of realized outflows, ordered by due day. */
export function OutflowTable({ transactions }: OutflowTableProps) {
  const sorted = [...transactions].sort((a, b) => a.dueDay - b.dueDay);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Saídas
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Organizadas por dia de vencimento.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Venc.</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">
                  {formatDueDay(tx.dueDay)}
                </TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>
                  <Badge variant={TYPE_VARIANT[tx.type]}>
                    {TYPE_LABELS[tx.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={tx.status === "ok" ? "success" : "warning"}>
                    {tx.status === "ok" ? "Pago" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(tx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
