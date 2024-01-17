import { createProduct } from './Product';
import { createPromotion } from './Promotion';
import { v4 as uuidv4 } from 'uuid';
import CartItem from './CartItem';

describe('CartItem specs', () => {
  const mac = {
    product: createProduct({
      sku: 'mac',
      price: 1000,
      name: 'MacBook Pro',
    }),
    promos: [
      createPromotion({
        id: '3-off-mac',
        description: '3% off on Mac if buy 3 or more',
        sku: 'mac',
        pricingRule: (cur, acc) => {
          if (cur.quantity >= 3) {
            return cur.price * (1 - 0.03) * cur.quantity;
          }
          return cur.price * cur.quantity;
        },
      }),
      createPromotion({
        id: '5-off-mac',
        description: '10% off on Mac if buy 5 or more',
        sku: 'mac',
        pricingRule: (cur, acc) => {
          if (cur.quantity >= 5) {
            return cur.price * (1 - 0.1) * cur.quantity;
          }
          return cur.price * cur.quantity;
        },
      }),
    ],
  };

  const homepod = {
    product: createProduct({
      sku: 'homepod',
      price: 100,
      name: 'Homepod',
    }),
    promos: [
      createPromotion({
        id: uuidv4(),
        sku: 'homepod',
        description: '50% off on at least 2 Macbooks (mac)',
        pricingRule: (cur, acc) => {
          const macs = acc.filter((item) => item.sku === 'mac');
          if (macs.length && macs[0].quantity >= 2) {
            return cur.price * cur.quantity * (1 - 0.5);
          }
          return cur.price * cur.quantity;
        },
      }),
      createPromotion({
        id: uuidv4(),
        sku: 'homepod',
        description: '75% off on at least 10 homepods',
        pricingRule: (cur, acc) => {
          if (cur.quantity >= 10) {
            return cur.price * cur.quantity * (1 - 0.75);
          }
          return cur.price * cur.quantity;
        },
      }),
    ],
  };

  it('should accept a product, a promotion and initial quantity. The quantity should be updatable.', () => {
    const item = new CartItem({
      id: uuidv4(),
      product: mac.product,
      quantity: 3,
    });
    expect(item.quantity).toBe(3);
    item.setQuantity(5);
    expect(item.quantity).toBe(5);
    let error: Error | undefined;
    try {
      item.setQuantity(-1);
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).toBe(
      `[CartItem:id=${item.id}][setQuantity] Quantity cannot be less than zero`,
    );
  });

  it('should accept a product, and initial quantity. Then provide the item total price', () => {
    const item = new CartItem({
      id: uuidv4(),
      product: mac.product,
      quantity: 3,
    });
    expect(item.quantity).toBe(3);
    expect(item.calculatePrice([])).toBe(3000);
  });

  it('should accept a product, promotion and initial quantity. Then provide the item total price applying the promotion', () => {
    const item = new CartItem({
      id: uuidv4(),
      product: mac.product,
      promotions: [mac.promos[0]],
      quantity: 2,
    });
    expect(item.quantity).toBe(2);
    expect(item.calculatePrice([])).toBe(2000);
    item.setQuantity(3);
    expect(item.quantity).toBe(3);
    expect(item.calculatePrice([])).toBe(2910);
  });

  it('should accept a product, multiple promotions and initial quantity. Then provide the item total price applying the best promotion', () => {
    const item = new CartItem({
      id: uuidv4(),
      product: mac.product,
      promotions: mac.promos,
      quantity: 2,
    });
    expect(item.quantity).toBe(2);
    expect(item.calculatePrice([])).toBe(2000);
    item.setQuantity(4);
    expect(item.quantity).toBe(4);
    expect(item.calculatePrice([])).toBe(3880);
    item.setQuantity(5);
    expect(item.quantity).toBe(5);
    expect(item.calculatePrice([])).toBe(4500);
  });

  it(`should apply promotion if the promotion conditions are met in a list of cart items`, () => {
    const items = [
      new CartItem({
        id: uuidv4(),
        product: mac.product,
        promotions: mac.promos,
        quantity: 4,
      }),
      new CartItem({
        id: uuidv4(),
        product: homepod.product,
        promotions: homepod.promos,
        quantity: 2,
      }),
    ];
    const calcTotalCost = () =>
      (items as CartItem[]).reduce((acc: number, cur: CartItem) => {
        return acc + cur.calculatePrice(items.filter((i) => i.id !== cur.id));
      }, 0);
    expect(calcTotalCost()).toBe(3980);
    items[0].setQuantity(1);
    expect(calcTotalCost()).toBe(1200);
    items[1].setQuantity(15);
    expect(calcTotalCost()).toBe(1375);
  });
});
