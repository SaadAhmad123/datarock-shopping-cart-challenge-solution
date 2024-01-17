/**
 * Represents the structure of a product with essential information.
 */
export interface IProduct {
  /**
   * The Stock Keeping Unit (SKU) of the product.
   */
  sku: string;
  /**
   * The name or title of the product.
   */
  name: string;
  /**
   * The price of the product as a number.
   */
  price: number;
}

/**
 * Represents a product with properties and a method for generating a string representation.
 * @example
 * // Example usage of the Product type
 * const exampleProduct: Product = {
 *   sku: 'ABC123',
 *   name: 'Example Product',
 *   price: 19.99,
 *   toString: () => 'SKU: ABC123 | Name: Example Product | Price: 19.99',
 * };
 */
export type Product = IProduct & {
  /**
   * The unique identifier for the product.
   */
  id: string;

  /**
   * Generates a string representation of the product.
   * @returns The string representation of the product.
   */
  toString: () => string;
};

/**
 * Creates a new instance of the Product type with the provided parameters.
 * @param params - The parameters to initialize the product.
 * @returns A new instance of the Product type.
 */
export function createProduct(params: IProduct): Product {
  if (params.price < 0) {
    throw new Error(
      `[createProduct][sku=${params.sku}] Price cannot be less han zero.`,
    );
  }
  return {
    ...params,
    id: params.sku,
    toString: () =>
      `SKU: ${params.sku} | Name: ${params.name} | Price: ${params.price}`,
  };
}
