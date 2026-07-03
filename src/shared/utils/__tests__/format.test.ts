import { calculateCartTotal, formatCurrency, formatDate } from '../format';

describe('format utilities', () => {
  it('formats currency in INR', () => {
    expect(formatCurrency(1500)).toBe('₹1,500');
  });

  it('formats date correctly', () => {
    const result = formatDate('2024-06-15T10:00:00.000Z');
    expect(result).toContain('2024');
  });
});

describe('calculateCartTotal', () => {
  it('sums product prices by quantity', () => {
    const items = [
      { product: { price: 100 }, quantity: 2 },
      { product: { price: 50 }, quantity: 1 },
    ];
    expect(calculateCartTotal(items)).toBe(250);
  });

  it('returns 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});
