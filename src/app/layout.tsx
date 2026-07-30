import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fingenius — Controle Financeiro",
  description:
    "Controle financeiro pessoal com a regra de orçamento 10/60/30 (Investimento/Despesas/Dívida).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
