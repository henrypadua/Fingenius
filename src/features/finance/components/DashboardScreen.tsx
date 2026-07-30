"use client";

import { Dashboard } from "@/features/finance/components/Dashboard";
import { useBudgetStore } from "@/features/finance/store/useBudgetStore";
import { useHasHydrated } from "@/features/finance/hooks/useHasHydrated";

/**
 * DashboardScreen — client container that binds the persisted budget store
 * to the presentation-only Dashboard.
 *
 * The store starts from the sample budget, so the first client render matches
 * the statically-exported HTML. `useHasHydrated` then loads any values the
 * user recorded on the Lançamentos screen from `localStorage`.
 */
export function DashboardScreen() {
  // Triggers rehydration of the persisted budget after mount.
  useHasHydrated();
  const budget = useBudgetStore((state) => state.budget);

  return <Dashboard budget={budget} />;
}
