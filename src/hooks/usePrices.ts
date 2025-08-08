"use client";

import * as React from "react";
import { getAssetPriceInfo } from "@funkit/api-base";
import type { PriceInfo } from "@/src/types/api";

type SymbolPriceState = {
  data?: PriceInfo;
  loading: boolean;
  error?: string;
};

const FUNKIT_API_KEY: string = process.env["NEXT_PUBLIC_FUNKIT_API_KEY"] ?? "";

export function usePrices(symbols: string[]): {
  map: Record<string, SymbolPriceState>;
  refresh: () => Promise<void>;
  loading: boolean;
  error?: string;
} {
  const [map, setMap] = React.useState<Record<string, SymbolPriceState>>({});
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchAll = React.useCallback(async () => {
    if (symbols.length === 0) return;
    setError(undefined);
    setMap((prev) => {
      const next: Record<string, SymbolPriceState> = { ...prev };
      for (const s of symbols)
        next[s] = { ...prev[s], loading: true, error: undefined };
      return next;
    });
    try {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const price = await getAssetPriceInfo({ symbol, apiKey: FUNKIT_API_KEY });
          const mapped: PriceInfo = {
            symbol: price.symbol,
            priceUsd: Number(price.priceUsd),
            updatedAt: price.updatedAt,
          };
          return mapped;
        })
      );
      setMap((prev) => {
        const next: Record<string, SymbolPriceState> = { ...prev };
        for (const r of results) next[r.symbol] = { data: r, loading: false };
        return next;
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch prices";
      setError(message);
      setMap((prev) => {
        const next: Record<string, SymbolPriceState> = { ...prev };
        for (const s of symbols)
          next[s] = { ...prev[s], loading: false, error: message };
        return next;
      });
    }
  }, [symbols]);

  React.useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const loading = React.useMemo(
    () => symbols.some((s) => map[s]?.loading),
    [symbols, map]
  );

  return { map, refresh: fetchAll, loading, error };
}
