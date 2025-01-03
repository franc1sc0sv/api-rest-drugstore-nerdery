import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/prisma.service.mocks';
import { CategoriesService } from '../categories.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from '../dtos/request/create-category.input';
import { UpdateCategoryInput } from '../dtos/request/update-category.input';
import { randomUUID } from 'crypto';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ id: randomUUID(), name: 'Category 1' }];
      prismaService.category.findMany = jest
        .fn()
        .mockResolvedValue(mockCategories);

      const result = await categoriesService.getAllCategories();
      expect(result).toEqual(mockCategories);
      expect(prismaService.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryByID', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        categoriesService.getCategoryByID(randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return the category if found', async () => {
      const mockCategory = { id: randomUUID(), name: 'Category 1' };
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue(mockCategory);

      const result = await categoriesService.getCategoryByID(mockCategory.id);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('createCategory', () => {
    it('should throw ConflictException if category name already exists', async () => {
      const createCategoryInput: CreateCategoryInput = {
        name: 'Category 1',
        description: 'a',
      };
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue({ id: randomUUID(), name: 'Category 1' });

      await expect(
        categoriesService.createCategory(createCategoryInput),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a category if name is unique', async () => {
      const createCategoryInput: CreateCategoryInput = {
        name: 'Category 1',
        description: 'a',
      };
      const createdCategory = { id: randomUUID(), ...createCategoryInput };
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.category.create = jest
        .fn()
        .mockResolvedValue(createdCategory);

      const result =
        await categoriesService.createCategory(createCategoryInput);
      expect(result).toEqual(createdCategory);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryInput,
      });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      const id = randomUUID();
      const updateCategoryInput: UpdateCategoryInput = {
        name: 'Updated Category',
      };
      const updatedCategory = { id, ...updateCategoryInput };
      prismaService.category.update = jest
        .fn()
        .mockResolvedValue(updatedCategory);

      const result = await categoriesService.updateCategory(
        id,
        updateCategoryInput,
      );
      expect(result).toEqual(updatedCategory);
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id },
        data: updateCategoryInput,
      });
    });
  });

  describe('removeCategory', () => {
    it('should remove the category', async () => {
      const id = randomUUID();
      prismaService.category.delete = jest.fn().mockResolvedValue({ id });

      const result = await categoriesService.removeCategory(id);
      expect(result).toBe(true);
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
