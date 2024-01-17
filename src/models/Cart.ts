import CartItem from './CartItem';
import { Product } from './Product';
import { Promotion } from './Promotion';

/**
 * Represents the structure of a cart with information about its id and fetchers for products and promotions.
 */
export interface ICart {
  /**
   * The unique identifier for the cart.
   */
  id: string;
  /**
   * Fetcher functions for retrieving product and promotion information by SKU.
   */
  fetchers: {
    /**
     * Fetches a product by SKU.
     * @param sku - The Stock Keeping Unit (SKU) of the product to fetch.
     * @returns A Promise that resolves to a Product or undefined if the product is not found.
     */
    product: (sku: string) => Promise<Product | undefined>;
    /**
     * Fetches promotions by SKU.
     * @param sku - The Stock Keeping Unit (SKU) of the product to fetch promotions for.
     * @returns A Promise that resolves to an array of Promotions or undefined if no promotions are found.
     */
    promotion: (sku: string) => Promise<Promotion[] | undefined>;
  };
}

/**
 * Represents a shopping cart with methods for adding, updating, and deleting items,
 * calculating total cost, and managing scanned items.
 */
export default class Cart {
  private cart: Record<string, CartItem> = {};

  /**
   * Creates a new instance of the Cart class.
   * @param param - The parameters to initialize the cart.
   */
  constructor(private param: ICart) {}

  /**
   * Adds a product to the cart with the specified quantity.
   * @param sku - The Stock Keeping Unit (SKU) of the product to add.
   * @param quantity - The quantity of the product to add.
   * @throws An error if the SKU already exists in the cart or SKU does not exist in product catelogue.
   */
  async add(sku: string, quantity: number) {
    if (this.cart[sku]) {
      throw new Error(
        `[Cart][add:sku=${sku}] The 'sku' already exists in the cart. Use 'update' to change the quantity or 'delete' to delete the item from cart`,
      );
    }
    const [product, promotions] = await Promise.all([
      this.param.fetchers.product(sku),
      this.param.fetchers.promotion(sku),
    ]);
    if (!product) {
      throw new Error(
        `[Card][add:sku=${sku}] The product with the provided 'sku' does not exist.`,
      );
    }
    this.cart[sku] = new CartItem({
      id: sku,
      product,
      promotions,
      quantity,
    });
  }

  /**
   * Deletes a product from the cart.
   * @param sku - The Stock Keeping Unit (SKU) of the product to delete.
   */
  delete(sku: string) {
    if (!this.cart[sku]) return;
    delete this.cart[sku];
  }

  /**
   * Updates the quantity of a product in the cart.
   * @param sku - The Stock Keeping Unit (SKU) of the product to update.
   * @param quantity - The new quantity of the product.
   * @throws An error if the SKU does not exist in the cart.
   */
  update(sku: string, quantity: number) {
    if (!this.cart[sku]) {
      throw new Error(
        `[Cart][update:sku=${sku}] The 'sku' does not exist in the cart. Use 'add' to add the product to the cart.`,
      );
    }
    this.cart[sku].setQuantity(quantity);
  }

  /**
   * Gets a cart item by its identifier.
   * @param id - The unique identifier of the cart item.
   * @returns The cart item with the specified identifier.
   * @throws An error if the identifier does not exist in the cart.
   */
  getItem(id: string) {
    if (!this.inCart(id)) {
      throw new Error(
        `[Cart][getSku(id=${id})] The 'id' of the product does not exist in the cart.`,
      );
    }
    return this.cart[id];
  }

  /**
   * Converts the cart to an array of objects representing each cart item.
   * Use this function to get a receipt.
   * @returns An array of objects representing each cart item.
   */
  toDict() {
    return Object.entries(this.cart).map(([key, value]) => ({
      id: key,
      product: value.product,
      promotions: value.promotions || [],
      quantity: value.quantity,
      cost: value.calculatePrice(
        Object.values(this.cart).filter((item) => item.id !== value.id),
      ),
    }));
  }

  /**
   * Calculates the total cost of all items in the cart.
   * @returns The total cost of all items in the cart.
   */
  totalCost() {
    return Object.entries(this.cart).reduce(
      (acc, [_, value]) =>
        acc +
        value.calculatePrice(
          Object.values(this.cart).filter((item) => item.id !== value.id),
        ),
      0,
    );
  }

  /**
   * Checks if a product with the specified identifier exists in the cart.
   * @param id - The unique identifier of the product.
   * @returns True if the product exists in the cart; otherwise, false.
   */
  inCart(id: string) {
    return Boolean(this.cart[id]);
  }

  /**
   * Scans a product by adding it to the cart or updating its quantity.
   * @param sku - The Stock Keeping Unit (SKU) of the product to scan.
   * @throws An error if the SKU does not exist in the products catelogue.
   */
  async scan(sku: string) {
    if (!this.inCart(sku)) {
      await this.add(sku, 1);
    } else {
      this.update(sku, this.cart[sku].quantity + 1);
    }
  }

  /**
   * Unscans a product by decrementing its quantity or removing it from the cart.
   * @param sku - The Stock Keeping Unit (SKU) of the product to unscan.
   */
  unscan(sku: string) {
    if (!this.inCart(sku)) return;
    if (this.cart[sku].quantity > 0) {
      this.update(sku, this.cart[sku].quantity - 1);
    }
    if (this.cart[sku].quantity <= 0) {
      this.delete(sku);
    }
  }
}
