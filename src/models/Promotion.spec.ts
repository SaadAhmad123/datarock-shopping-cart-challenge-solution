import { createProduct } from './Product';
import { IPromotion, createPromotion } from './Promotion';

describe('Specifiction for a Promotion Model', () => {
  const product = createProduct({
    sku: 'mac',
    price: 1000,
    name: 'MacBook Pro',
  });

  const params: IPromotion = {
    id: '3-off-mac',
    description: '3% off on Mac if buy 3 or more',
    sku: 'mac',
    pricingRule: (cur, acc) => {
      if (cur.quantity >= 3) {
        return cur.price * (1 - 0.03) * cur.quantity;
      }
      return cur.price * cur.quantity;
    },
  };

  it('should accept a promotion id, product sku, description and pricing rule and should have a toString methods for printing', () => {
    const promo = createPromotion(params);
    expect(promo.toString()).toBe(
      `Promotion => ID:${params.id} | Product SKU:${params.sku} | Description:${params.description}`,
    );
  });

  it('should apply promotion with 3 mac book products are there', () => {
    const promo = createPromotion(params);
    const totalPrice = promo.pricingRule({ ...product, quantity: 3 }, []);
    expect(totalPrice).toBe(2910);
  });
});
