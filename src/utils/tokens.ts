import type { TokenOption } from "@/src/types/api";

export const SUPPORTED_TOKENS: TokenOption[] = [
  { label: "USDC (Ethereum)", value: "USDC", chainId: 1 },
  { label: "USDT (Polygon)", value: "USDT", chainId: 137 },
  { label: "ETH (Base)", value: "ETH", chainId: 8453 },
  { label: "WBTC (Ethereum)", value: "WBTC", chainId: 1 },
  // Additional commonly traded tokens
  { label: "DAI (Ethereum)", value: "DAI", chainId: 1 },
  { label: "LINK (Ethereum)", value: "LINK", chainId: 1 },
  { label: "AAVE (Ethereum)", value: "AAVE", chainId: 1 },
  { label: "UNI (Ethereum)", value: "UNI", chainId: 1 },
  { label: "COMP (Ethereum)", value: "COMP", chainId: 1 },
  { label: "WETH (Ethereum)", value: "WETH", chainId: 1 },
  { label: "MATIC (Polygon)", value: "MATIC", chainId: 137 },
  { label: "SUSHI (Ethereum)", value: "SUSHI", chainId: 1 },
];

export function findTokenBySymbol(symbol: string): TokenOption | undefined {
  return SUPPORTED_TOKENS.find((t) => t.value === symbol);
}
