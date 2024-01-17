import { fetchSampleProduct } from '../data/products';
import { fetchSamplePromotions } from '../data/promotions';
import Cart, { ICart } from './Cart';
import { v4 as uuidv4 } from 'uuid';

describe('Cart spec', () => {
  const cartParams: ICart = {
    id: uuidv4(),
    fetchers: {
      product: async (sku: string) => fetchSampleProduct(sku),
      promotion: async (sku: string) => fetchSamplePromotions(sku),
    },
  };

  it(`should throw error if product not found`, async () => {
    let error: Error | undefined;
    try {
      const cart = new Cart(cartParams);
      const skus: string[] = ['atv', 'atv', 'atv', 'saad'];
      for (const item of skus) {
        await cart.scan(item);
      }
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).toBe(
      "[Card][add:sku=saad] The product with the provided 'sku' does not exist.",
    );
  });

  it(`should not allow duplicate adds`, async () => {
    let error: Error | undefined;
    try {
      const cart = new Cart(cartParams);
      const skus: string[] = ['atv', 'atv'];
      for (const item of skus) {
        await cart.add(item, 1);
      }
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).toBe(
      "[Cart][add:sku=atv] The 'sku' already exists in the cart. Use 'update' to change the quantity or 'delete' to delete the item from cart",
    );
  });

  it(`should be able to delete items from cart`, async () => {
    let error: Error | undefined;
    const cart = new Cart(cartParams);
    const skus: string[] = ['atv', 'mbp'];
    for (const item of skus) {
      await cart.add(item, 1);
    }
    expect(cart.inCart('atv')).toBe(true);
    expect(cart.inCart('mbp')).toBe(true);
    for (const item of skus) {
      cart.delete(item);
    }
    expect(cart.inCart('atv')).toBe(false);
    expect(cart.inCart('mbp')).toBe(false);
  });

  it(`should be able to unscan products as well`, async () => {
    const cart = new Cart(cartParams);
    const skus: string[] = ['atv', 'atv'];
    for (const item of skus) {
      await cart.scan(item);
    }
    expect(cart.getItem('atv').quantity).toBe(2);
    cart.unscan('atv');
    expect(cart.getItem('atv').quantity).toBe(1);
    expect(cart.inCart('atv')).toBe(true);
    cart.unscan('atv');
    expect(cart.inCart('atv')).toBe(false);
  });

  it('should -> SKUs Scanned: atv, atv, atv, vga - Total expected: $249.00', async () => {
    const cart = new Cart(cartParams);
    const skus: string[] = ['atv', 'atv', 'atv', 'vga'];
    for (const item of skus) {
      await cart.scan(item);
    }
    expect(cart.totalCost()).toBe(249.0);
  });

  it('should -> Return a break down of all the items', async () => {
    const cart = new Cart(cartParams);
    const skus: string[] = ['ipd', 'ipd', 'del'];
    for (const item of skus) {
      await cart.scan(item);
    }
    const receipt = cart.toDict();
    const ipd = receipt.filter((item) => item.id === 'ipd')[0];
    expect(ipd.cost).toBe(2 * 549.99);
    expect(ipd.promotions.length).toBe(1);
    const del = receipt.filter((item) => item.id === 'del')[0];
    expect(del.cost).toBe(300);
    expect(del.promotions.length).toBe(0);
  });
});
