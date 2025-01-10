import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { NotFoundException } from '@nestjs/common';

import { mockUser } from '../../../__mocks__/data/user.mock';
import {
  fixedQuantity,
  mockAddNewItemToCartInput,
  mockCart,
  mockCartCalculateTotal,
  mockCartItem,
} from '../../../__mocks__/data/cart.mock';

describe('CartsService', () => {
  let cartsService: CartsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    cartsService = module.get<CartsService>(CartsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findCartByUserId', () => {
    it('should throw NotFoundException if no cart is found', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(null);

      try {
        await cartsService.findCartByUserId(mockUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Cart not found for the given user.');
      }
    });

    it('should return the cart if found', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart);

      const result = await cartsService.findCartByUserId(mockUser);
      expect(result).toEqual(mockCart);
    });
  });

  describe('addItemToCart', () => {
    it('should create a new cart if none exists', async () => {
      prismaService.cart.findFirst = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockCart,
          cartItems: [mockAddNewItemToCartInput],
        });

      prismaService.cart.create = jest.fn().mockResolvedValue(mockCart);

      prismaService.cartItem.create = jest.fn().mockResolvedValue(mockCartItem);

      const result = await cartsService.addItemToCart(
        mockAddNewItemToCartInput,
        mockUser,
      );

      expect(prismaService.cart.create).toHaveBeenCalledWith({
        data: { userId: mockUser.id },
      });

      expect(prismaService.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: mockCart.id,
          productId: mockAddNewItemToCartInput.productId,
          quantity: fixedQuantity,
        },
      });

      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockCart.id);
      expect(result.cartItems).toEqual([
        { productId: mockCartItem.productId, quantity: mockCartItem.quantity },
      ]);
    });

    it('should update the existing cart item if it already exists', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart);
      prismaService.cartItem.findFirst = jest
        .fn()
        .mockResolvedValue(mockCartItem);
      prismaService.cartItem.update = jest.fn().mockResolvedValue(mockCartItem);

      const result = await cartsService.addItemToCart(
        mockAddNewItemToCartInput,
        mockUser,
      );
      expect(result).toBeDefined();
      expect(prismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
        data: { quantity: fixedQuantity + mockCartItem.quantity },
      });
    });
  });

  describe('removeCartItem', () => {
    it('should throw NotFoundException if cart item does not exist', async () => {
      prismaService.cartItem.findUnique = jest.fn().mockResolvedValue(null);

      try {
        await cartsService.removeCartItem({ id: mockCartItem.id }, mockUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Cart item not found.');
      }
    });

    it('should successfully remove a cart item', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart);
      prismaService.cartItem.findUnique = jest
        .fn()
        .mockResolvedValue(mockCartItem);
      prismaService.cartItem.delete = jest.fn().mockResolvedValue(mockCartItem);

      const result = await cartsService.removeCartItem(
        { id: mockCartItem.id },
        mockUser,
      );
      expect(result).toBe(true);
      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
      });
    });
  });

  describe('calculateTotal', () => {
    it('should return total 0 if the cart has no items', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart);

      const result = await cartsService.calculateTotal(mockUser);
      expect(result.total).toBe(0);
    });

    it('should return the correct total', async () => {
      prismaService.cart.findFirst = jest
        .fn()
        .mockResolvedValue(mockCartCalculateTotal);
      const expectedTotal = mockCartCalculateTotal.cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
      );
      const result = await cartsService.calculateTotal(mockUser);
      expect(result.total).toBeGreaterThan(0);
      expect(result.total).toBe(expectedTotal);
    });
  });
});
