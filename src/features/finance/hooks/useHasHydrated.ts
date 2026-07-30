"use client";

import { useEffect, useState } from "react";
import { useBudgetStore } from "@/features/finance/store/useBudgetStore";

/**
 * useHasHydrated
 * ------------------------------------------------------------------
 * The budget store persists to `localStorage` with `skipHydration`, so the
 * server-rendered / statically-exported HTML always reflects the seed budget.
 * This hook triggers the manual rehydration after mount and reports when the
 * persisted state is ready.
 *
 * Components should render a neutral placeholder while this returns `false`
 * to keep the first client render identical to the static HTML (no hydration
 * mismatch), then switch to the persisted budget once it resolves to `true`.
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // rehydrate() returns a promise; mark ready when it settles.
    const persist = useBudgetStore.persist;
    const unsub = persist.onFinishHydration(() => setHydrated(true));

    void persist.rehydrate();

    // If there was nothing to rehydrate the callback may not fire.
    if (persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  return hydrated;
}
