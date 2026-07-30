import type { Metadata } from "next";
import { LaunchScreen } from "@/features/finance/components/LaunchScreen";

export const metadata: Metadata = {
  title: "Lançamentos — Fingenius",
  description:
    "Registre entradas (receitas) e saídas (despesas, dívidas, investimentos) para alimentar o painel de controle financeiro.",
};

export default function LancamentosPage() {
  return <LaunchScreen />;
}
