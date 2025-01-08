const createMockModel = () => ({
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  findUnique: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
});

export const mockPrismaService = {
  user: createMockModel(),
  revokedToken: createMockModel(),
  product: createMockModel(),
  category: createMockModel(),
  productImage: createMockModel(),
  like: createMockModel(),
  cart: createMockModel(),
  cartItem: createMockModel(),
  order: createMockModel(),
  orderItem: createMockModel(),
  paymentIntent: createMockModel(),
};
