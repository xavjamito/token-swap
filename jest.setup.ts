import "@testing-library/jest-dom";

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number): R;
    }
  }
}

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

// Mock @funkit/api-base
jest.mock("@funkit/api-base", () => ({
  getAssetErc20ByChainAndSymbol: jest.fn(),
  getAssetPriceInfo: jest.fn(),
}));

// Mock @web3icons/react
jest.mock("@web3icons/react", () => ({
  TokenIcon: jest
    .fn()
    .mockImplementation(({ symbol }) => `MockTokenIcon-${symbol}`),
}));

// Mock components that import @web3icons - use absolute path
jest.mock("@/components/TokenIcon", () => ({
  TokenIcon: jest
    .fn()
    .mockImplementation(({ symbol }) => `MockTokenIcon-${symbol}`),
}));

// Mock environment variables
process.env["NEXT_PUBLIC_FUNKIT_API_KEY"] = "test-api-key";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia for theme provider
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
