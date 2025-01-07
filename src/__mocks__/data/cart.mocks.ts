import { CartModel } from 'src/common/models/cart.model';
import { mockUser } from './user.mocks';
import { AddItemToCartInput } from 'src/modules/carts/dtos/request/add-item-to-cart.input';
import { CartItemModel } from 'src/common/models/cart-item.model';
import { randomUUID } from 'crypto';

export const mockCart: CartModel = {
  id: randomUUID(),
  userId: mockUser.id,
  cartItems: [],
};

export const mockCartItem: CartItemModel = {
  id: randomUUID(),
  cartId: mockCart.id,
  productId: randomUUID(),
  quantity: 1,
};

export const mockAddNewItemToCartInput: AddItemToCartInput = {
  productId: mockCartItem.productId,
  quantity: 1,
};
