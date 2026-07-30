import { Dashboard } from "@/features/finance/components/Dashboard";
import { sampleBudget } from "@/features/finance/data/sample-budget";

export default function Home() {
  return <Dashboard budget={sampleBudget} />;
}
