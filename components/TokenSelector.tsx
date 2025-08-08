"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { SUPPORTED_TOKENS } from "@/src/utils/tokens";

export interface TokenSelectorProps {
  label: string;
  value: string;
  onChange: (symbol: string) => void;
}

export function TokenSelector({ label, value, onChange }: TokenSelectorProps): React.JSX.Element {
  const [query, setQuery] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return SUPPORTED_TOKENS;
    return SUPPORTED_TOKENS.filter((t) => t.label.toLowerCase().includes(q) || t.value.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="w-full">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="relative">
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={(e) => {
            const menu = (e.currentTarget.nextSibling as HTMLDivElement | null);
            if (menu) menu.classList.toggle("hidden");
          }}
        >
          <span>{value}</span>
          <CaretSortIcon className="h-4 w-4 opacity-70" />
        </button>
        <div className="absolute z-10 mt-1 hidden w-full rounded-md border bg-popover p-2 shadow">
          <input
            placeholder="Search token"
            className="mb-2 w-full rounded border px-2 py-1 text-sm outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-56 overflow-auto">
            {filtered.map((token) => (
              <button
                key={`${token.value}-${token.chainId}`}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                  value === token.value ? "bg-accent" : undefined
                )}
                type="button"
                onClick={(e) => {
                  onChange(token.value);
                  const menu = (e.currentTarget.closest("div.absolute") as HTMLDivElement | null);
                  if (menu) menu.classList.add("hidden");
                }}
              >
                <span>
                  {token.label}
                </span>
                {value === token.value ? <CheckIcon className="h-4 w-4" /> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


