"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TokenIcon as W3TokenIcon } from "@web3icons/react";

export interface TokenIconProps {
  symbol: string;
  className?: string;
  size?: number;
  variant?: "branded" | "mono";
}

export function TokenIcon({
  symbol,
  className,
  size = 18,
  variant = "branded",
}: TokenIconProps) {
  const lower = symbol?.toLowerCase?.() ?? "";

  if (lower) {
    return (
      <W3TokenIcon
        symbol={lower}
        size={size}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-zinc-500 text-white select-none",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, Math.floor(size * 0.6)),
      }}
    >
      {symbol?.slice(0, 3).toUpperCase?.() ?? "?"}
    </span>
  );
}

export default TokenIcon;
