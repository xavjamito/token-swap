import type { TokenOption } from "@/src/types/api";

export const SUPPORTED_TOKENS: TokenOption[] = [
  { label: "USDC (Ethereum)", value: "USDC", chainId: 1 },
  { label: "USDT (Polygon)", value: "USDT", chainId: 137 },
  { label: "ETH (Base)", value: "ETH", chainId: 8453 },
  { label: "WBTC (Ethereum)", value: "WBTC", chainId: 1 },
];

export function findTokenBySymbol(symbol: string): TokenOption | undefined {
  return SUPPORTED_TOKENS.find((t) => t.value === symbol);
}

