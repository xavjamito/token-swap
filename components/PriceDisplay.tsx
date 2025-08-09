"use client";

import * as React from "react";
import { TokenIcon } from "@/components/TokenIcon";

export interface PriceDisplayProps {
  usdAmount: number;
  fromSymbol: string;
  fromPriceUsd?: number;
  toSymbol: string;
  toPriceUsd?: number;
  loading?: boolean;
  error?: string;
}

export function PriceDisplay(props: PriceDisplayProps): React.JSX.Element {
  const {
    usdAmount,
    fromSymbol,
    fromPriceUsd,
    toSymbol,
    toPriceUsd,
    loading,
    error,
  } = props;

  const fromAmount = fromPriceUsd ? usdAmount / fromPriceUsd : undefined;
  const toAmount = toPriceUsd ? usdAmount / toPriceUsd : undefined;

  return (
    <div className="grid grid-cols-1 gap-3 text-sm">
      {loading ? (
        <div className="text-muted-foreground">Loading prices…</div>
      ) : null}
      {error ? <div className="text-red-600">{error}</div> : null}
      <div className="rounded-md border p-3">
        <div className="font-medium mb-1">From</div>
        <div className="text-muted-foreground flex items-center gap-2">
          {fromAmount !== undefined ? (
            <>
              <TokenIcon symbol={fromSymbol} />
              <span>
                {fromAmount.toFixed(6)} {fromSymbol}
              </span>
            </>
          ) : (
            "—"
          )}
        </div>
      </div>
      <div className="rounded-md border p-3">
        <div className="font-medium mb-1">To</div>
        <div className="text-muted-foreground flex items-center gap-2">
          {toAmount !== undefined ? (
            <>
              <TokenIcon symbol={toSymbol} />
              <span>
                {toAmount.toFixed(6)} {toSymbol}
              </span>
            </>
          ) : (
            "—"
          )}
        </div>
      </div>
    </div>
  );
}
