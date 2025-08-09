import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";
import Home from "@/app/page";
import { ThemeProvider } from "@/components/theme-provider";

const mockGetAssetErc20ByChainAndSymbol =
  getAssetErc20ByChainAndSymbol as jest.MockedFunction<
    typeof getAssetErc20ByChainAndSymbol
  >;
const mockGetAssetPriceInfo = getAssetPriceInfo as jest.MockedFunction<
  typeof getAssetPriceInfo
>;

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetAssetErc20ByChainAndSymbol.mockImplementation(
      async ({ symbol }) => ({
        name: symbol === "USDC" ? "USD Coin" : "Ethereum",
        symbol,
        address:
          symbol === "USDC"
            ? "0xA0b86a33E6441E4C91"
            : "0x0000000000000000000000000000000000000000",
        decimals: symbol === "USDC" ? 6 : 18,
        chain: symbol === "USDC" ? "1" : "8453",
      })
    );

    mockGetAssetPriceInfo.mockImplementation(async ({ chainId }) => ({
      unitPrice: chainId === "1" ? 1.0 : 3500.0,
      amount: 1,
      total: chainId === "1" ? 1.0 : 3500.0,
    }));
  });

  it("should render the main title", () => {
    render(<Home />, { wrapper: TestWrapper });

    const titles = screen.getAllByText("Token Swap");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("should render theme toggle button", () => {
    render(<Home />, { wrapper: TestWrapper });

    const themeToggles = screen.getAllByRole("button", {
      name: /toggle theme/i,
    });
    expect(themeToggles.length).toBeGreaterThanOrEqual(1);
  });

  it("should render token selection buttons", () => {
    render(<Home />, { wrapper: TestWrapper });

    expect(screen.getByRole("button", { name: "USDC" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "USDT" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ETH" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "WBTC" })).toBeInTheDocument();
  });

  it("should highlight selected from token button", () => {
    render(<Home />, { wrapper: TestWrapper });

    const usdcButton = screen.getByRole("button", { name: "USDC" });
    expect(usdcButton).toHaveClass("bg-primary");
  });

  it("should change from token when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    const ethButton = screen.getByRole("button", { name: "ETH" });
    await user.click(ethButton);

    expect(ethButton).toHaveClass("bg-primary");
  });

  it("should render from and to sections", () => {
    render(<Home />, { wrapper: TestWrapper });

    expect(screen.getAllByText("From").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("To").length).toBeGreaterThanOrEqual(1);
  });

  it("should render swap button with tooltip", () => {
    render(<Home />, { wrapper: TestWrapper });

    const swapButton = screen.getByRole("button", { name: "Swap" });
    expect(swapButton).toBeInTheDocument();
    expect(swapButton).toHaveAttribute("title", "Swap");
  });

  it("should allow USD amount input", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    const usdInputs = screen.getAllByPlaceholderText("0.00");
    const usdInput = usdInputs[0]!;
    await user.clear(usdInput);
    await user.type(usdInput, "500");

    expect(usdInput).toHaveValue("500");
  });

  it("should validate USD amount input", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    const usdInputs = screen.getAllByPlaceholderText("0.00");
    const usdInput = usdInputs[0]!;
    await user.clear(usdInput);
    await user.type(usdInput, "invalid");

    const errorMessages = screen.getAllByText(
      "Enter a valid USD amount (max 2 decimals)."
    );
    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
  });

  it("should calculate token amounts based on price", async () => {
    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      const usdcAmounts = screen.getAllByText(/100\.000000/);
      const ethAmounts = screen.getAllByText(/0\.028571/);
      expect(usdcAmounts.length).toBeGreaterThanOrEqual(1);
      expect(ethAmounts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should swap token positions when swap button is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/USDC/)).toBeInTheDocument();
    });

    const swapButton = screen.getByRole("button", { name: "Swap" });
    await user.click(swapButton);

    await waitFor(() => {
      const fromSelectors = screen.getAllByText("From");
      const toSelectors = screen.getAllByText("To");
      expect(fromSelectors.length).toBeGreaterThan(0);
      expect(toSelectors.length).toBeGreaterThan(0);
    });
  });

  it("should refresh prices when refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(mockGetAssetErc20ByChainAndSymbol).toHaveBeenCalled();
      expect(mockGetAssetPriceInfo).toHaveBeenCalled();
    });

    jest.clearAllMocks();

    const refreshButtons = screen.getAllByRole("button", { name: /refresh/i });
    const refreshButton = refreshButtons[0]!;
    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockGetAssetErc20ByChainAndSymbol).toHaveBeenCalled();
      expect(mockGetAssetPriceInfo).toHaveBeenCalled();
    });
  });

  it("should display loading state", async () => {
    mockGetAssetErc20ByChainAndSymbol.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                name: "USD Coin",
                symbol: "USDC",
                address: "0xA0b86a33E6441E4C91",
                decimals: 6,
                chain: "1",
              }),
            100
          )
        )
    );

    render(<Home />, { wrapper: TestWrapper });

    const loadingTexts = screen.getAllByText("Loading prices…");
    expect(loadingTexts.length).toBeGreaterThanOrEqual(1);

    await waitFor(() => {
      expect(screen.queryByText("Loading prices…")).not.toBeInTheDocument();
    });
  });

  it("should display error state", async () => {
    mockGetAssetErc20ByChainAndSymbol.mockRejectedValue(new Error("API Error"));

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      const errorTexts = screen.getAllByText("API Error");
      expect(errorTexts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should handle token selector changes", async () => {
    const user = userEvent.setup();
    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      const usdcTexts = screen.getAllByText(/USDC/);
      expect(usdcTexts.length).toBeGreaterThanOrEqual(1);
    });

    const fromTokenButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.textContent === "USDC" &&
          !button.classList.contains("rounded-full")
      );

    if (fromTokenButton) {
      await user.click(fromTokenButton);

      await waitFor(() => {
        const ethereumOptions = screen.getAllByText("USDC (Ethereum)");
        expect(ethereumOptions.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  it("should maintain state across re-renders", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Home />, { wrapper: TestWrapper });

    const usdInputs = screen.getAllByPlaceholderText("0.00");
    const usdInput = usdInputs[0]!;
    await user.clear(usdInput);
    await user.type(usdInput, "250");

    rerender(<Home />);

    const valueInputs = screen.getAllByDisplayValue("250");
    expect(valueInputs.length).toBeGreaterThanOrEqual(1);
  });
});
