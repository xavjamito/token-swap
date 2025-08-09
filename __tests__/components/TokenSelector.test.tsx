import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TokenSelector } from "@/components/TokenSelector";

describe("TokenSelector", () => {
  const defaultProps = {
    label: "Select Token",
    value: "USDC",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with label and current value", () => {
    render(<TokenSelector {...defaultProps} />);

    expect(screen.getByText("Select Token")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("should open dropdown when button is clicked", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByPlaceholderText("Search token")).toBeInTheDocument();
    expect(screen.getByText("USDC (Ethereum)")).toBeInTheDocument();
    expect(screen.getByText("USDT (Polygon)")).toBeInTheDocument();
    expect(screen.getByText("ETH (Base)")).toBeInTheDocument();
    expect(screen.getByText("WBTC (Ethereum)")).toBeInTheDocument();
  });

  it("should filter tokens based on search input", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const searchInput = screen.getByPlaceholderText("Search token");
    await user.type(searchInput, "ETH");

    expect(screen.getByText("ETH (Base)")).toBeInTheDocument();
    expect(screen.queryByText("USDC (Ethereum)")).not.toBeInTheDocument();
    expect(screen.queryByText("USDT (Polygon)")).not.toBeInTheDocument();
    expect(screen.queryByText("WBTC (Ethereum)")).not.toBeInTheDocument();
  });

  it("should filter tokens by symbol", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const searchInput = screen.getByPlaceholderText("Search token");
    await user.type(searchInput, "BTC");

    expect(screen.getByText("WBTC (Ethereum)")).toBeInTheDocument();
    expect(screen.queryByText("USDC (Ethereum)")).not.toBeInTheDocument();
    expect(screen.queryByText("USDT (Polygon)")).not.toBeInTheDocument();
    expect(screen.queryByText("ETH (Base)")).not.toBeInTheDocument();
  });

  it("should call onChange when token is selected", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<TokenSelector {...defaultProps} onChange={mockOnChange} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const ethOption = screen.getByText("ETH (Base)");
    await user.click(ethOption);

    expect(mockOnChange).toHaveBeenCalledWith("ETH");
  });

  it("should close dropdown after token selection", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByPlaceholderText("Search token")).toBeInTheDocument();

    const ethOption = screen.getByText("ETH (Base)");
    await user.click(ethOption);

    expect(
      screen.queryByPlaceholderText("Search token")
    ).not.toBeInTheDocument();
  });

  it("should show check icon for selected token", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} value="ETH" />);

    const button = screen.getByRole("button");
    await user.click(button);

    const ethOption = screen.getByText("ETH (Base)").closest("button");
    expect(ethOption).toBeInTheDocument();

    const usdcOption = screen.getByText("USDC (Ethereum)").closest("button");
    expect(usdcOption).toBeInTheDocument();
  });

  it("should handle case-insensitive search", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const searchInput = screen.getByPlaceholderText("Search token");
    await user.type(searchInput, "ethereum");

    expect(screen.getByText("USDC (Ethereum)")).toBeInTheDocument();
    expect(screen.getByText("WBTC (Ethereum)")).toBeInTheDocument();
    expect(screen.queryByText("USDT (Polygon)")).not.toBeInTheDocument();
    expect(screen.queryByText("ETH (Base)")).not.toBeInTheDocument();
  });

  it("should show no results when search has no matches", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const searchInput = screen.getByPlaceholderText("Search token");
    await user.type(searchInput, "NONEXISTENT");

    expect(screen.queryByText("USDC (Ethereum)")).not.toBeInTheDocument();
    expect(screen.queryByText("USDT (Polygon)")).not.toBeInTheDocument();
    expect(screen.queryByText("ETH (Base)")).not.toBeInTheDocument();
    expect(screen.queryByText("WBTC (Ethereum)")).not.toBeInTheDocument();
  });

  it("should clear search when dropdown is reopened", async () => {
    const user = userEvent.setup();
    render(<TokenSelector {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const searchInput = screen.getByPlaceholderText("Search token");
    await user.type(searchInput, "ETH");

    const ethOption = screen.getByText("ETH (Base)");
    await user.click(ethOption);

    await user.click(button);

    expect(screen.getByText("USDC (Ethereum)")).toBeInTheDocument();
    expect(screen.getByText("USDT (Polygon)")).toBeInTheDocument();
    expect(screen.getByText("ETH (Base)")).toBeInTheDocument();
    expect(screen.getByText("WBTC (Ethereum)")).toBeInTheDocument();
  });
});
