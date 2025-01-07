import { faker } from '@faker-js/faker';
import { CartModel } from 'src/common/models/cart.model';
import { CartItemModel } from 'src/common/models/cart-item.model';
import { mockUser } from './user.mocks';
import { AddItemToCartInput } from 'src/modules/carts/dtos/request/add-item-to-cart.input';
import { generateProduct } from './product.mocks';

const generateCartItem = (cartId: string): CartItemModel => {
  const product = generateProduct();
  return {
    id: faker.string.uuid(),
    cartId,
    productId: product.id,
    quantity: faker.number.int({ min: 1, max: 5 }),
    product,
  };
};

const cartIdTotalCart = faker.string.uuid();
const cartItems = Array.from({ length: 3 }, () =>
  generateCartItem(cartIdTotalCart),
);
const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.quantity * item.product.price,
  0,
);

export const mockCartCalculateTotal: CartModel & { totalPrice: number } = {
  id: cartIdTotalCart,
  userId: mockUser.id,
  cartItems,
  totalPrice,
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
