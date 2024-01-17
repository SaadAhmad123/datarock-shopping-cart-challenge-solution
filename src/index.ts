import { fetchSampleProduct } from './data/products';
import { fetchSamplePromotions } from './data/promotions';
import Cart, { ICart } from './models/Cart';
import { v4 as uuidv4 } from 'uuid';

const cartParams: ICart = {
  id: uuidv4(),
  fetchers: {
    product: async (sku: string) => fetchSampleProduct(sku),
    promotion: async (sku: string) => fetchSamplePromotions(sku),
  },
};

const cases = [
  {
    description: 'SKUs Scanned: atv, atv, atv, vga - Total expected: $249.00',
    exec: async () => {
      const cart = new Cart(cartParams);
      await cart.scan("atv")
      await cart.scan("atv")
      await cart.scan("atv")
      await cart.scan("vga")
      return {
        cost: cart.totalCost(),
        expect: cart.totalCost() === 249.0,
        receipt: cart.toDict(),
      };
    },
  },
  {
    description:
      'SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd - Total expected: $2718.95',
    exec: async () => {
      const cart = new Cart(cartParams);
      const skus: string[] = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd'];
      for (const item of skus) {
        await cart.scan(item);
      }
      return {
        cost: cart.totalCost(),
        expect: cart.totalCost() === 2718.95,
        receipt: cart.toDict(),
      };
    },
  },
  {
    description: 'SKUs Scanned: mbp, vga, ipd - Total expected: $1949.98',
    exec: async () => {
      const cart = new Cart(cartParams);
      const skus: string[] = ['mbp', 'vga', 'ipd'];
      for (const item of skus) {
        await cart.scan(item);
      }
      return {
        cost: cart.totalCost(),
        expect: cart.totalCost() === 1949.98,
        receipt: cart.toDict(),
      };
    },
  },
];

async function main() {
  for (const item of cases) {
    const result = await item.exec();

    console.log(
      JSON.stringify(
        {
          description: item.description,
          totalCost: result.cost,
          asExpectation: result.expect,
          receipt: result.receipt.map((item) => ({
            product: item.product.name,
            quantity: item.quantity,
            promotions: (item.promotions || []).map((item) => item.description),
            finalCost: item.cost,
          })),
        },
        null,
        2,
      ),
    );
    console.log('\n----\n');
  }
}

main();
