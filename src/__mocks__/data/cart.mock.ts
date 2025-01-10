import { faker } from '@faker-js/faker';
import { CartModel } from 'src/common/models/cart.model';
import { CartItemModel } from 'src/common/models/cart-item.model';
import { mockUser } from './user.mock';
import { AddItemToCartInput } from 'src/modules/carts/dtos/request/add-item-to-cart.input';
import { generateProduct } from './product.mock';

export const generateCartItem = (cartId: string): CartItemModel => {
  const product = generateProduct();
  return {
    id: faker.string.uuid(),
    cartId,
    productId: product.id,
    quantity: faker.number.int({ min: 1, max: 5 }),
    product,
  };
};
export const calculateTotalPrice = (cartItems: CartItemModel[]) =>
  cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

const cartIdTotalCart = faker.string.uuid();

const cartItems = Array.from({ length: 3 }, () =>
  generateCartItem(cartIdTotalCart),
);

export const mockCartCalculateTotal: CartModel & { totalPrice: number } = {
  id: cartIdTotalCart,
  userId: mockUser.id,
  cartItems,
  totalPrice: calculateTotalPrice(cartItems),
};

///

export const fixedQuantity = faker.number.int({ min: 1, max: 10 });
export const mockCart: CartModel = {
  id: faker.string.uuid(),
  userId: mockUser.id,
  cartItems: [],
};

export const mockCartItem: CartItemModel = {
  id: faker.string.uuid(),
  cartId: mockCart.id,
  productId: faker.string.uuid(),
  quantity: fixedQuantity,
};

export const mockAddNewItemToCartInput: AddItemToCartInput = {
  productId: mockCartItem.productId,
  quantity: fixedQuantity,
};
