import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { mockPrismaService } from '../../../__mocks__/dependecies/prisma.service.mocks';
import { CategoriesService } from '../categories.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from '../dtos/request/create-category.input';
import { UpdateCategoryInput } from '../dtos/request/update-category.input';
import {
  mockCategory,
  mockCategories,
} from '../../../__mocks__/data/categories.mock';

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
        categoriesService.getCategoryByID({ id: mockCategory.id }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return the category if found', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue(mockCategory);

      const result = await categoriesService.getCategoryByID({
        id: mockCategory.id,
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('createCategory', () => {
    it('should throw ConflictException if category name already exists', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue(mockCategory);

      const createCategoryInput: CreateCategoryInput = {
        name: mockCategory.name,
        description: mockCategory.description,
      };

      await expect(
        categoriesService.createCategory(createCategoryInput),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a category if name is unique', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.category.create = jest.fn().mockResolvedValue(mockCategory);

      const createCategoryInput: CreateCategoryInput = {
        name: mockCategory.name,
        description: mockCategory.description,
      };

      const result =
        await categoriesService.createCategory(createCategoryInput);
      expect(result).toEqual(mockCategory);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryInput,
      });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      prismaService.category.update = jest.fn().mockResolvedValue(mockCategory);

      const updateCategoryInput: UpdateCategoryInput = {
        name: mockCategory.name,
      };

      const result = await categoriesService.updateCategory(
        { id: mockCategory.id },
        updateCategoryInput,
      );
      expect(result).toEqual(mockCategory);
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: mockCategory.id },
        data: updateCategoryInput,
      });
    });
  });

  describe('removeCategory', () => {
    it('should remove the category', async () => {
      prismaService.category.delete = jest
        .fn()
        .mockResolvedValue({ id: mockCategory.id });

      const result = await categoriesService.removeCategory({
        id: mockCategory.id,
      });
      expect(result).toBe(true);
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: mockCategory.id },
      });
    });
  });
});
