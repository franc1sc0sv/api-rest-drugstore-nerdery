import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { NotFoundException } from '@nestjs/common';
import { CartDto } from 'src/common/models/cart.model';
import { AddItemToCartInput } from '../dtos/request/add-item-to-cart.input';
import { IdDto } from 'src/common/models/id.dto.model';
import { UserDto } from 'src/common/models/user.model';
import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';

const user: UserDto = {
  id: randomUUID(),
  email: 'test@example.com',
  password: 'hashedPassword',
  name: 'Test User',
  role: Role.CLIENT,
  resetToken: null,
  resetTokenExpiry: null,
  stripeCustomerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    it('should be defined', () => {
      expect(cartsService.findCartByUserId).toBeDefined();
    });

    it('should throw NotFoundException if no cart is found', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(null);

      try {
        await cartsService.findCartByUserId({ id: randomUUID() } as UserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Cart not found for the given user.');
      }
    });

    it('should return the cart if found', async () => {
      const mockCart: CartDto = {
        id: randomUUID(),
        userId: randomUUID(),
        cartItems: [],
      };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart);

      const result = await cartsService.findCartByUserId({
        id: randomUUID(),
      } as UserDto);
      expect(result).toEqual(mockCart);
    });
  });

  describe('addItemToCart', () => {
    it('should be defined', () => {
      expect(cartsService.addItemToCart).toBeDefined();
    });

    it('should create a new cart if none exists', async () => {
      const addItemToCartInput: AddItemToCartInput = {
        productId: randomUUID(),
        quantity: 1,
      };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.cart.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID(), userId: user.id });
      prismaService.cartItem.create = jest.fn().mockResolvedValue({
        id: randomUUID(),
        productId: addItemToCartInput.productId,
        quantity: 1,
      });

      const result = await cartsService.addItemToCart(addItemToCartInput, user);
      expect(result).toBeDefined();
      expect(prismaService.cart.create).toHaveBeenCalledWith({
        data: { userId: user.id },
      });
    });

    it('should update the existing cart item if it already exists', async () => {
      const addItemToCartInput: AddItemToCartInput = {
        productId: randomUUID(),
        quantity: 2,
      };

      const existingCartItem = {
        id: randomUUID(),
        productId: addItemToCartInput.productId,
        quantity: 1,
      };
      const cart = {
        id: randomUUID(),
        userId: user.id,
        cartItems: [existingCartItem],
      };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(cart);
      prismaService.cartItem.findFirst = jest
        .fn()
        .mockResolvedValue(existingCartItem);
      prismaService.cartItem.update = jest.fn().mockResolvedValue({
        id: randomUUID(),
        productId: addItemToCartInput.productId,
        quantity: 3,
      });

      const result = await cartsService.addItemToCart(addItemToCartInput, user);
      expect(result).toBeDefined();
      expect(prismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: existingCartItem.id },
        data: { quantity: 3 },
      });
    });
  });

  describe('removeCartItem', () => {
    it('should be defined', () => {
      expect(cartsService.removeCartItem).toBeDefined();
    });

    it('should throw NotFoundException if cart item does not exist', async () => {
      prismaService.cartItem.findUnique = jest.fn().mockResolvedValue(null);

      try {
        await cartsService.removeCartItem(
          { id: randomUUID() } as IdDto,
          { id: randomUUID() } as UserDto,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Cart item not found.');
      }
    });

    it('should successfully remove a cart item', async () => {
      const cartItem = {
        id: randomUUID(),
        productId: randomUUID(),
        quantity: 1,
      };
      const cart = {
        id: randomUUID(),
        userId: randomUUID(),
        cartItems: [cartItem],
      };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(cart);
      prismaService.cartItem.findUnique = jest.fn().mockResolvedValue(cartItem);
      prismaService.cartItem.delete = jest.fn().mockResolvedValue(cartItem);

      const result = await cartsService.removeCartItem(
        { id: randomUUID() } as IdDto,
        { id: randomUUID() } as UserDto,
      );
      expect(result).toBe(true);
      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: cartItem.id },
      });
    });
  });

  describe('calculateTotal', () => {
    it('should be defined', () => {
      expect(cartsService.calculateTotal).toBeDefined();
    });

    it('should return total 0 if the cart has no items', async () => {
      const cart = { id: randomUUID(), userId: randomUUID(), cartItems: [] };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(cart);

      const result = await cartsService.calculateTotal({
        id: randomUUID(),
      } as UserDto);
      expect(result.total).toBe(0);
    });

    it('should return the correct total', async () => {
      const cart = {
        id: randomUUID(),
        userId: randomUUID(),
        cartItems: [
          { product: { price: 10 }, quantity: 2 },
          { product: { price: 5 }, quantity: 3 },
        ],
      };
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(cart);

      const result = await cartsService.calculateTotal({
        id: randomUUID(),
      } as UserDto);
      expect(result.total).toBe(35);
    });
  });
});
