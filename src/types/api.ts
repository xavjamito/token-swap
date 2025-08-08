export interface Erc20AssetRequest {
  chainId: number;
  symbol: string;
}

export interface Erc20Asset {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
}

export interface PriceInfoRequest {
  symbol: string;
}

export interface PriceInfo {
  symbol: string;
  priceUsd: number;
  updatedAt: string;
}

export interface TokenOption {
  label: string;
  value: string;
  chainId: number;
}

