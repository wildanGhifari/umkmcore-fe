import { http, HttpResponse } from 'msw';

const products = [
  { id: 1, name: 'Product 1', price: 10, image: 'p1.jpg', sku: 'P001' },
  { id: 2, name: 'Product 2', price: 20, image: 'p2.jpg', sku: 'P002' },
];

export const handlers = [
  http.get('/api/v1/products', () => {
    return HttpResponse.json({
      data: products,
      page: 1,
      pages: 1,
    });
  }),

  http.post('/api/v1/sales-orders', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      id: 1,
      ...data,
    });
  }),
];
