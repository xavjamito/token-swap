# Token Swap Application

A production-ready React application for crypto token swapping with real-time price calculations. Built with Next.js, TypeScript, and modern UI components.

## Features

- Real-time crypto token price fetching using Funkit API
- Support for major tokens: USDC, USDT, ETH, WBTC, and more
- Responsive design with desktop and mobile layouts
- Dark/light theme toggle with persistent preferences
- USD amount input with validation (up to 2 decimal places)
- Token position swapping functionality
- Live price calculations and updates
- Comprehensive error handling and loading states
- Full TypeScript type safety throughout

## Setup Instructions

### Prerequisites

- Node.js 22 or higher
- npm package manager

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd token-swap
   ```

2. **Set Node.js version**

   ```bash
   nvm use
   # If Node.js 22 is not installed: nvm install 22
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Environment configuration**
   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_FUNKIT_API_KEY=your_api_key_here
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Deployed Application

[Link to deployed application will be added here]

## Technical Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v3
- **Component Library**: shadcn/ui (Radix UI primitives)
- **API Integration**: @funkit/api-base
- **Testing**: Jest + React Testing Library
- **Theme Management**: next-themes

## Design Decisions and Assumptions

### Architecture Choices

1. **Next.js App Router**: Chosen for modern React patterns, built-in optimizations, and excellent TypeScript support
2. **shadcn/ui Components**: Provides accessible, customizable UI components with consistent design system
3. **Custom Hooks Pattern**: Separated API logic (`useFunkit`, `usePrices`) from UI components for better testability and reusability
4. **TypeScript Strict Mode**: Ensures type safety and catches potential runtime errors during development

### API Integration

1. **Funkit API**: Integrated for real-time token and price data
2. **Error Handling**: Comprehensive error states for network failures and invalid responses
3. **Loading States**: User feedback during API calls to improve perceived performance
4. **Price Refresh**: Manual refresh capability for users to get latest price data

### UI/UX Decisions

1. **Responsive Design**:
   - Desktop: Horizontal layout with token selection buttons and side-by-side swap sections
   - Mobile: Vertical stacked layout for better touch interaction
2. **Theme Support**: Dark mode as default with persistent user preference storage
3. **Input Validation**: Real-time USD amount validation with clear error messaging
4. **Token Selection**: Dropdown interface with search functionality for better token discovery

### Supported Tokens

The application supports these tokens with their respective chain networks:

- USDC (Ethereum - Chain ID: 1)
- USDT (Polygon - Chain ID: 137)
- ETH (Base - Chain ID: 8453)
- WBTC (Ethereum - Chain ID: 1)
- Additional tokens: DAI, LINK, AAVE, UNI, COMP, WETH, MATIC, SUSHI

### Testing Strategy

1. **Unit Tests**: Individual component and utility function testing
2. **Integration Tests**: API integration and user interaction flows
3. **Responsive Testing**: Verification of both desktop and mobile layouts
4. **Mock Strategy**: Comprehensive mocking of external dependencies for reliable test execution

### Assumptions Made

1. **API Reliability**: Funkit API provides consistent response formats and availability
2. **Token Support**: Limited to predefined token list for initial implementation
3. **Price Precision**: USD amounts limited to 2 decimal places for practical usage
4. **Browser Support**: Modern browsers with JavaScript enabled
5. **Network Connectivity**: Users have stable internet connection for real-time price updates

### Future Enhancements

1. **Wallet Integration**: Connect user wallets for actual token swapping
2. **Transaction History**: Track and display user's swap history
3. **Price Charts**: Historical price data visualization
4. **Token Search**: Dynamic token discovery beyond predefined list
5. **Slippage Settings**: Advanced trading parameters configuration
