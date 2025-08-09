import { SUPPORTED_TOKENS, findTokenBySymbol } from '@/src/utils/tokens'

describe('tokens utils', () => {
  describe('SUPPORTED_TOKENS', () => {
    it('should contain expected tokens', () => {
      expect(SUPPORTED_TOKENS.length).toBeGreaterThanOrEqual(4)
      
      const symbols = SUPPORTED_TOKENS.map(token => token.value)
      expect(symbols).toContain('USDC')
      expect(symbols).toContain('USDT')
      expect(symbols).toContain('ETH')
      expect(symbols).toContain('WBTC')
    })

    it('should have correct structure for each token', () => {
      SUPPORTED_TOKENS.forEach(token => {
        expect(token).toHaveProperty('label')
        expect(token).toHaveProperty('value')
        expect(token).toHaveProperty('chainId')
        expect(typeof token.label).toBe('string')
        expect(typeof token.value).toBe('string')
        expect(typeof token.chainId).toBe('number')
      })
    })

    it('should have correct chain IDs', () => {
      const usdcToken = SUPPORTED_TOKENS.find(t => t.value === 'USDC')
      const usdtToken = SUPPORTED_TOKENS.find(t => t.value === 'USDT')
      const ethToken = SUPPORTED_TOKENS.find(t => t.value === 'ETH')
      const wbtcToken = SUPPORTED_TOKENS.find(t => t.value === 'WBTC')

      expect(usdcToken?.chainId).toBe(1) // Ethereum
      expect(usdtToken?.chainId).toBe(137) // Polygon
      expect(ethToken?.chainId).toBe(8453) // Base
      expect(wbtcToken?.chainId).toBe(1) // Ethereum
    })
  })

  describe('findTokenBySymbol', () => {
    it('should find existing tokens', () => {
      expect(findTokenBySymbol('USDC')).toEqual({
        label: 'USDC (Ethereum)',
        value: 'USDC',
        chainId: 1
      })

      expect(findTokenBySymbol('ETH')).toEqual({
        label: 'ETH (Base)',
        value: 'ETH',
        chainId: 8453
      })
    })

    it('should return undefined for non-existing tokens', () => {
      expect(findTokenBySymbol('BTC')).toBeUndefined()
      expect(findTokenBySymbol('DOGE')).toBeUndefined()
      expect(findTokenBySymbol('')).toBeUndefined()
    })

    it('should be case sensitive', () => {
      expect(findTokenBySymbol('usdc')).toBeUndefined()
      expect(findTokenBySymbol('Usdc')).toBeUndefined()
      expect(findTokenBySymbol('USDC')).toBeDefined()
    })
  })
})
