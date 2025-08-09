"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "@/components/TokenSelector";
import { isValidUsdAmount } from "@/lib/utils";
import { usePrices } from "@/src/hooks/usePrices";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

  const tokenButtons = [
    { symbol: "USDC", label: "USDC" },
    { symbol: "USDT", label: "USDT" },
    { symbol: "ETH", label: "ETH" },
    { symbol: "WBTC", label: "WBTC" },
  ];

  return (
    <main className="min-h-screen w-full p-4 md:p-8">
      <div className="hidden md:block max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-center flex-1">
            Token Swap
          </h1>
          <ThemeToggle />
        </div>

        <div className="flex justify-center gap-4">
          {tokenButtons.map((token) => (
            <Button
              key={token.symbol}
              variant={fromSymbol === token.symbol ? "default" : "outline"}
              className="px-6 py-3 text-lg min-w-[100px]"
              onClick={() => setFromSymbol(token.symbol)}
            >
              {token.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="w-80 h-96 rounded-lg border-2 border-border p-6 space-y-4">
            <div className="text-sm text-muted-foreground">From</div>
            <div className="space-y-4">
              <TokenSelector
                label=""
                value={fromSymbol}
                onChange={setFromSymbol}
              />
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  USD Amount
                </div>
                <Input
                  inputMode="decimal"
                  placeholder="0.00"
                  value={usd}
                  onChange={(e) => setUsd(e.target.value)}
                  className="text-lg"
                />
                {!isValidUsdAmount(usd) && (
                  <div className="text-xs text-red-600 mt-1">
                    Enter a valid USD amount (max 2 decimals).
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Token Amount
                </div>
                <div className="text-lg font-medium">
                  {fromPrice && usdAmount
                    ? (usdAmount / fromPrice).toFixed(6)
                    : "—"}{" "}
                  {fromSymbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${fromPrice ? fromPrice.toFixed(4) : "—"} per {fromSymbol}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={swap}
              className="p-3 rounded-full"
              title="Swap"
            >
              <ArrowLeftRight className="h-6 w-6" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void refresh()}
              className="px-4 py-2"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="w-80 h-96 rounded-lg border-2 border-border p-6 space-y-4">
            <div className="text-sm text-muted-foreground">To</div>
            <div className="space-y-4">
              <TokenSelector label="" value={toSymbol} onChange={setToSymbol} />
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  You will receive
                </div>
                <div className="text-lg font-medium">
                  {toPrice && usdAmount
                    ? (usdAmount / toPrice).toFixed(6)
                    : "—"}{" "}
                  {toSymbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${toPrice ? toPrice.toFixed(4) : "—"} per {toSymbol}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(loading || error) && (
          <div className="text-center">
            {loading && (
              <div className="text-muted-foreground">Loading prices…</div>
            )}
            {error && <div className="text-red-600">{error}</div>}
          </div>
        )}
      </div>

      <div className="md:hidden w-full max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Token Swap</h1>
          <ThemeToggle />
        </div>
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
          <div className="grid grid-cols-1 gap-3 text-sm">
            {loading ? (
              <div className="text-muted-foreground">Loading prices…</div>
            ) : null}
            {error ? <div className="text-red-600">{error}</div> : null}
            <div className="rounded-md border p-3">
              <div className="font-medium mb-1">From</div>
              <div className="text-muted-foreground">
                {fromPrice && usdAmount
                  ? `${(usdAmount / fromPrice).toFixed(6)} ${fromSymbol}`
                  : "—"}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="font-medium mb-1">To</div>
              <div className="text-muted-foreground">
                {toPrice && usdAmount
                  ? `${(usdAmount / toPrice).toFixed(6)} ${toSymbol}`
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
