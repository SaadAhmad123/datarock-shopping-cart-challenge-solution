import { Product } from './Product';
import { Promotion } from './Promotion';

/**
 * Represents the structure of a cart item with information about the product,
 * promotion (if any), and quantity.
 */
export interface ICartItem {
  /**
   * The unique identifier for the cart item.
   */
  id: string;
  /**
   * The product associated with the cart item.
   */
  product: Product;
  /**
   * The promotion applied to the product (optional).
   */
  promotions?: Promotion[];
  /**
   * The quantity of the product in the cart.
   */
  quantity: number;
}

/**
 * Represents a cart item with read-only properties for id, product, promotion, and quantity.
 */
export default class CartItem {
  /**
   * The unique identifier for the cart item.
   */
  public readonly id: string;
  /**
   * The product associated with the cart item.
   */
  public readonly product: Product;
  /**
   * The promotion applied to the product (optional).
   */
  public readonly promotions?: Promotion[];
  /**
   * The quantity of the product in the cart.
   */
  private _quantity: number = 0;

  public get quantity(): number {
    return this._quantity;
  }

  public setQuantity(quantity: number) {
    if (quantity < 0) {
      throw new Error(
        `[CartItem:id=${this.id}][setQuantity] Quantity cannot be less than zero`,
      );
    }
    this._quantity = quantity;
  }

  /**
   * Creates a new instance of the CartItem class.
   * @param params - The parameters to initialize the cart item.
   */
  constructor({ id, product, promotions, quantity }: ICartItem) {
    this.id = id;
    this.product = product;
    this.promotions = promotions;
    this.setQuantity(quantity);
  }

  /**
   * Calculates the total price of the cart item, considering the promotion (if any) and other cart items.
   * @param otherCartItems - An array of other cart items for calculation.
   * @returns The total price of the cart item.
   * @throws An error if otherCartItems contain the same item as this cart item.
   */
  calculatePrice(otherCartItems: CartItem[]): number {
    if (otherCartItems.some((item) => item.id === this.id)) {
      throw new Error(
        `[CartItem:id=${this.id}][calculatePrice] The provided cart items must be other than this item.`,
      );
    }

    if (!this.promotions?.length) {
      return this.product.price * this.quantity;
    }

    return Math.min(
      ...this.promotions.map((item) =>
        item.pricingRule(
          { ...this.product, quantity: this.quantity },
          otherCartItems.map((item) => ({
            ...item.product,
            quantity: item.quantity,
          })),
        ),
      ),
    );
  }
}
