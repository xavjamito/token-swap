"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "@/components/TokenSelector";
import { PriceDisplay } from "@/components/PriceDisplay";
import { isValidUsdAmount } from "@/lib/utils";
import { usePrices } from "@/src/hooks/usePrices";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, RefreshCcw } from "lucide-react";

export default function Home(): React.JSX.Element {
  const [fromSymbol, setFromSymbol] = React.useState<string>("USDC");
  const [toSymbol, setToSymbol] = React.useState<string>("ETH");
  const [usd, setUsd] = React.useState<string>("100");

  const swap = React.useCallback(() => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  }, [fromSymbol, toSymbol]);

  const usdAmount = React.useMemo(
    () => (isValidUsdAmount(usd) ? Number(usd || 0) : 0),
    [usd]
  );

  const { map, refresh, loading, error } = usePrices([fromSymbol, toSymbol]);
  const fromPrice = map[fromSymbol]?.data?.priceUsd;
  const toPrice = map[toSymbol]?.data?.priceUsd;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Token Swap</h1>
        <div className="rounded-lg border p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <TokenSelector
              label="From"
              value={fromSymbol}
              onChange={setFromSymbol}
            />
            <TokenSelector label="To" value={toSymbol} onChange={setToSymbol} />
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                USD Amount
              </div>
              <Input
                inputMode="decimal"
                placeholder="0.00"
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
              />
              {!isValidUsdAmount(usd) ? (
                <div className="text-xs text-red-600 mt-1">
                  Enter a valid USD amount (max 2 decimals).
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={swap}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Swap tokens
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void refresh()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh prices
            </Button>
          </div>
          <PriceDisplay
            usdAmount={usdAmount}
            fromSymbol={fromSymbol}
            fromPriceUsd={fromPrice}
            toSymbol={toSymbol}
            toPriceUsd={toPrice}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
