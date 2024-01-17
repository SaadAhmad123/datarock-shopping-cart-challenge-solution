import { IProduct } from './Product';

export interface IProductWithQuantity extends IProduct {
  quantity: number;
}

/**
 * Defines the function signature for a price calculation function.
 * It takes the current product and an array of existing products
 * and returns the calculated total price.
 */
export type PriceCalculationFunction = (
  currentProduct: IProductWithQuantity,
  existingProducts: IProductWithQuantity[],
) => number;
