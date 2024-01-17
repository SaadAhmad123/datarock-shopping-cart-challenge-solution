import { PriceCalculationFunction } from './types';

/**
 * Represents the structure of a promotion applied to a product.
 */
export interface IPromotion {
  /**
   * The unique identifier for the promotion.
   */
  id: string;
  /**
   * The Stock Keeping Unit (SKU) of the product to which the promotion applies.
   */
  sku: string;
  /**
   * A description of the promotion.
   */
  description: string;
  /**
   * The pricing rule function defining how the promotion affects the product's price.
   */
  pricingRule: PriceCalculationFunction;
}

/**
 * Represents a promotion with properties and a method for generating a string representation.
 * @example
 * // Example usage of the Promotion type
 * const examplePromotion: Promotion = {
 *   promotionId: 'PROMO123',
 *   sku: 'ABC123',
 *   description: '20% off',
 *   pricingRule: (currentProduct, existingProducts) => {
 *     // Custom price calculation logic based on the promotion
 *     // ...
 *     return calculatedPrice;
 *   },
 *   toString: () => 'Promo: PROMO123 | Product SKU: ABC123 | Description: 20% off',
 * };
 */
export type Promotion = IPromotion & {
  /**
   * Generates a string representation of the promotion.
   * @returns The string representation of the promotion.
   */
  toString: () => string;
};

/**
 * Creates a new instance of the Promotion type with the provided parameters.
 * @param params - The parameters to initialize the promotion.
 * @returns A new instance of the Promotion type.
 */
export function createPromotion(params: IPromotion): Promotion {
  return {
    ...params,
    toString: () =>
      `Promotion => ID:${params.id} | Product SKU:${params.sku} | Description:${params.description}`,
  };
}
