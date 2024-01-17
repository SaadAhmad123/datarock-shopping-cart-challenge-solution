import { v4 as uuidv4 } from 'uuid';
import { Promotion, createPromotion, IPromotion } from '../models/Promotion';

/**
 * Calculates the quotient and remainder of dividing the given value by the divisor.
 * @param value - The dividend.
 * @param divisor - The divisor.
 * @returns An object containing the quotient and remainder.
 * @example
 * ```typescript
 * const result = calculateQuotientAndRemainder(10, 3);
 * console.log(result); // Output: { quotient: 3, remainder: 1 }
 * ```
 */
function calculateQuotientAndRemainder(
  value: number,
  divisor: number,
): { quotient: number; remainder: number } {
  if (divisor === 0) {
    throw new Error('Cannot divide by zero.');
  }
  const quotient = Math.floor(value / divisor);
  const remainder = value % divisor;
  return { quotient, remainder };
}

const samplePromotions: Promotion[] = (
  [
    {
      id: uuidv4(),
      sku: 'atv',
      description: `we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only`,
      pricingRule: (cur, acc) => {
        if (cur.quantity < 3) return cur.quantity * cur.price;
        const { quotient, remainder } = calculateQuotientAndRemainder(
          cur.quantity,
          3,
        );
        return cur.price * quotient * 2 + remainder * cur.price;
      },
    },
    {
      id: uuidv4(),
      sku: 'ipd',
      description: `the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4`,
      pricingRule: (cur, acc) => {
        if (cur.quantity <= 4) return cur.quantity * cur.price;
        return cur.quantity * 499.99;
      },
    },
    {
      id: uuidv4(),
      sku: 'vga',
      description: `we will bundle in a free VGA adapter free of charge with every MacBook Pro sold`,
      pricingRule: (cur, acc) => {
        const numberOfMbp = acc.reduce((a, c) => {
          if (c.sku === 'mbp') return a + c.quantity;
          return a;
        }, 0);
        return (cur.quantity - numberOfMbp) * cur.price;
      },
    },
  ] as IPromotion[]
).map(createPromotion);

export function fetchSamplePromotions(sku: string): Promotion[] | undefined {
  const promos = samplePromotions.filter((item) => item.sku === sku);
  if (!promos.length) return undefined;
  return promos;
}
