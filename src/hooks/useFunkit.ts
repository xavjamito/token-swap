"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { findTokenBySymbol } from "@/src/utils/tokens";
import type {
  Erc20Asset,
  Erc20AssetRequest,
  PriceInfo,
  PriceInfoRequest,
} from "@/src/types/api";

interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

const FUNKIT_API_KEY: string = process.env["NEXT_PUBLIC_FUNKIT_API_KEY"] ?? "";

export function useFunkitApi() {
  const [assetState, setAssetState] = useState<AsyncState<Erc20Asset>>({
    loading: false,
  });
  const [priceState, setPriceState] = useState<AsyncState<PriceInfo>>({
    loading: false,
  });

  const hasApiKey = useMemo(() => FUNKIT_API_KEY.length > 0, []);

  const fetchAsset = useCallback(async (req: Erc20AssetRequest) => {
    setAssetState({ loading: true });
    try {
      const asset = await getAssetErc20ByChainAndSymbol({
        chainId: String(req.chainId),
        symbol: req.symbol,
        apiKey: FUNKIT_API_KEY,
      });
      const mapped: Erc20Asset = {
        name: asset.name,
        symbol: asset.symbol,
        address: asset.address,
        decimals: asset.decimals,
        chainId: req.chainId,
      };
      setAssetState({ loading: false, data: mapped });
      return mapped;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch asset";
      setAssetState({ loading: false, error: message });
      throw e;
    }
  }, []);

  const fetchPrice = useCallback(async (req: PriceInfoRequest) => {
    setPriceState({ loading: true });
    try {
      const token = findTokenBySymbol(req.symbol);
      if (!token) {
        throw new Error(`Unsupported token: ${req.symbol}`);
      }
      const asset = await getAssetErc20ByChainAndSymbol({
        chainId: String(token.chainId),
        symbol: req.symbol,
        apiKey: FUNKIT_API_KEY,
      });
      const price = await getAssetPriceInfo({
        chainId: String(token.chainId),
        assetTokenAddress: asset.address,
        apiKey: FUNKIT_API_KEY,
      });
      const mapped: PriceInfo = {
        symbol: req.symbol,
        priceUsd: Number(price.unitPrice),
        updatedAt: new Date().toISOString(),
      };
      setPriceState({ loading: false, data: mapped });
      return mapped;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch price";
      setPriceState({ loading: false, error: message });
      throw e;
    }
  }, []);

  return {
    hasApiKey,
    assetState,
    priceState,
    fetchAsset,
    fetchPrice,
  };
}
