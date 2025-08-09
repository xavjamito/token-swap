import { renderHook, waitFor, act } from "@testing-library/react";
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import { usePrices } from "@/src/hooks/usePrices";

const mockGetAssetErc20ByChainAndSymbol =
  getAssetErc20ByChainAndSymbol as jest.MockedFunction<
    typeof getAssetErc20ByChainAndSymbol
  >;
const mockGetAssetPriceInfo = getAssetPriceInfo as jest.MockedFunction<
  typeof getAssetPriceInfo
>;

describe("usePrices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => usePrices([]));

    expect(result.current.map).toEqual({});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should fetch prices for provided symbols", async () => {
    mockGetAssetErc20ByChainAndSymbol.mockResolvedValueOnce({
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86a33E6441E4C91",
      decimals: 6,
      chain: "1",
    });

    mockGetAssetPriceInfo.mockResolvedValueOnce({
      unitPrice: 1.0,
      amount: 1,
      total: 1.0,
    });

    const { result } = renderHook(() => usePrices(["USDC"]));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.map["USDC"]?.data).toEqual({
      symbol: "USDC",
      priceUsd: 1.0,
      updatedAt: expect.any(String),
    });
    expect(result.current.error).toBeUndefined();
  });

  it("should handle API errors gracefully", async () => {
    const errorMessage = "API Error";
    mockGetAssetErc20ByChainAndSymbol.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => usePrices(["USDC"]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.map["USDC"]?.error).toBe(errorMessage);
  });

  it("should fetch multiple symbols", async () => {
    mockGetAssetErc20ByChainAndSymbol
      .mockResolvedValueOnce({
        name: "USD Coin",
        symbol: "USDC",
        address: "0xA0b86a33E6441E4C91",
        decimals: 6,
        chain: "1",
      })
      .mockResolvedValueOnce({
        name: "Ethereum",
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        chain: "8453",
      });

    mockGetAssetPriceInfo
      .mockResolvedValueOnce({
        unitPrice: 1.0,
        amount: 1,
        total: 1.0,
      })
      .mockResolvedValueOnce({
        unitPrice: 3500.0,
        amount: 1,
        total: 3500.0,
      });

    const { result } = renderHook(() => usePrices(["USDC", "ETH"]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.map["USDC"]?.data?.priceUsd).toBe(1.0);
    expect(result.current.map["ETH"]?.data?.priceUsd).toBe(3500.0);
  });

  it("should refresh prices when refresh is called", async () => {
    mockGetAssetErc20ByChainAndSymbol.mockResolvedValue({
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86a33E6441E4C91",
      decimals: 6,
      chain: "1",
    });

    mockGetAssetPriceInfo
      .mockResolvedValueOnce({
        unitPrice: 1.0,
        amount: 1,
        total: 1.0,
      })
      .mockResolvedValueOnce({
        unitPrice: 1.01,
        amount: 1,
        total: 1.01,
      });

    const { result } = renderHook(() => usePrices(["USDC"]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.map["USDC"]?.data?.priceUsd).toBe(1.0);

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.map["USDC"]?.data?.priceUsd).toBe(1.01);
  });

  it("should handle symbol changes correctly", async () => {
    mockGetAssetErc20ByChainAndSymbol.mockResolvedValue({
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86a33E6441E4C91",
      decimals: 6,
      chain: "1",
    });

    mockGetAssetPriceInfo.mockResolvedValue({
      unitPrice: 1.0,
      amount: 1,
      total: 1.0,
    });

    const { result, rerender } = renderHook(
      ({ symbols }) => usePrices(symbols),
      { initialProps: { symbols: ["USDC"] } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(Object.keys(result.current.map)).toEqual(["USDC"]);

    rerender({ symbols: ["ETH"] });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(Object.keys(result.current.map)).toContain("ETH");
  });
});
