import { isValidUsdAmount, cn } from '@/lib/utils'

describe('utils', () => {
  describe('isValidUsdAmount', () => {
    it('should return true for valid USD amounts', () => {
      expect(isValidUsdAmount('100')).toBe(true)
      expect(isValidUsdAmount('100.50')).toBe(true)
      expect(isValidUsdAmount('0.99')).toBe(true)
      expect(isValidUsdAmount('1000000')).toBe(true)
      expect(isValidUsdAmount('0')).toBe(true)
      expect(isValidUsdAmount('0.1')).toBe(true)
    })

    it('should return false for invalid USD amounts', () => {
      expect(isValidUsdAmount('')).toBe(false)
      expect(isValidUsdAmount(' ')).toBe(false)
      expect(isValidUsdAmount('abc')).toBe(false)
      expect(isValidUsdAmount('100.123')).toBe(false) // More than 2 decimals
      expect(isValidUsdAmount('.50')).toBe(false) // Leading dot without number
      expect(isValidUsdAmount('-100')).toBe(false) // Negative
      expect(isValidUsdAmount('100.50.25')).toBe(false) // Multiple dots
    })

    it('should handle edge cases with trailing dots', () => {
      // Note: Our regex allows trailing dots, this is acceptable UX
      expect(isValidUsdAmount('100.')).toBe(true) // Trailing dot is allowed
    })

    it('should handle edge cases', () => {
      expect(isValidUsdAmount('00')).toBe(true)
      expect(isValidUsdAmount('00.00')).toBe(true)
      expect(isValidUsdAmount('1.0')).toBe(true)
    })
  })

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })
  })
})
