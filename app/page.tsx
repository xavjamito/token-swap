"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "@/components/TokenSelector";
import { PriceDisplay } from "@/components/PriceDisplay";
import { isValidUsdAmount } from "@/lib/utils";
import { useFunkitApi } from "@/src/hooks/useFunkit";
import { findTokenBySymbol } from "@/src/utils/tokens";

export default function Home(): React.JSX.Element {
  const { fetchPrice, priceState } = useFunkitApi();
  const [fromSymbol, setFromSymbol] = React.useState<string>("USDC");
  const [toSymbol, setToSymbol] = React.useState<string>("ETH");
  const [usd, setUsd] = React.useState<string>("100");

  const swap = React.useCallback(() => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  }, [fromSymbol, toSymbol]);

  const usdAmount = React.useMemo(() => (isValidUsdAmount(usd) ? Number(usd || 0) : 0), [usd]);

  React.useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const from = findTokenBySymbol(fromSymbol);
      const to = findTokenBySymbol(toSymbol);
      if (!from || !to) return;
      try {
        await Promise.all([
          fetchPrice({ symbol: fromSymbol }),
          fetchPrice({ symbol: toSymbol }),
        ]);
      } catch {
        // handled in hook state
      }
    };
    void run();
    return () => controller.abort();
  }, [fromSymbol, toSymbol, fetchPrice]);

  const fromPrice = priceState.data?.symbol === fromSymbol ? priceState.data.priceUsd : undefined;
  const toPrice = priceState.data?.symbol === toSymbol ? priceState.data.priceUsd : undefined;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Token Swap</h1>
        <div className="rounded-lg border p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <TokenSelector label="From" value={fromSymbol} onChange={setFromSymbol} />
            <TokenSelector label="To" value={toSymbol} onChange={setToSymbol} />
            <div>
              <div className="text-sm text-muted-foreground mb-1">USD Amount</div>
              <Input
                inputMode="decimal"
                placeholder="0.00"
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
              />
              {!isValidUsdAmount(usd) ? (
                <div className="text-xs text-red-600 mt-1">Enter a valid USD amount (max 2 decimals).</div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={swap}
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            Swap tokens
          </button>
          <PriceDisplay
            usdAmount={usdAmount}
            fromSymbol={fromSymbol}
            fromPriceUsd={fromPrice}
            toSymbol={toSymbol}
            toPriceUsd={toPrice}
            loading={priceState.loading}
            error={priceState.error}
          />
        </div>
      </div>
    </main>
  );
}
