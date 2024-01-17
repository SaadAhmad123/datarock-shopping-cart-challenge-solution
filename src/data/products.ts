import { IProduct, Product, createProduct } from '../models/Product';

export const sampleProducts: Product[] = (
  [
    {
      sku: 'ipd',
      name: 'Super iPad',
      price: 549.99,
    },
    {
      sku: 'mbp',
      name: 'MacBook Pro',
      price: 1399.99,
    },
    {
      sku: 'atv',
      name: 'Apple TV',
      price: 109.5,
    },
    {
      sku: 'vga',
      name: 'VGA adapter',
      price: 30.0,
    },
    {
      sku: 'del',
      name: 'Dell Laptop',
      price: 300.0,
    },
  ] as IProduct[]
).map(createProduct);

export function fetchSampleProduct(sku: string): Product | undefined {
  const prd = sampleProducts.filter((item) => item.sku === sku);
  if (!prd.length) return undefined;
  return prd[0];
}
