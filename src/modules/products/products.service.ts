import { Injectable, NotFoundException } from '@nestjs/common';

import { ImagesService } from '../images/images.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductInput } from './dtos/request/create-products.input';
import { UploadImageResponseResponse } from '../images/dtos/response/upload-image.response';

import { IdDto } from 'src/common/dtos/id.dto';
import { UploadProductImageInput } from './dtos/request/upload-product-images.input';
import { UpdateProductInput } from './dtos/request/update-products.input';
import { UpdateProductStatusInput } from './dtos/request/update-product-status.input';
import { GetProductsInput } from './dtos/request/get-products.input';

import { ProductModel } from 'src/common/models/product.model';
import { GetProductsResponse } from './dtos/response/get-products.response';

const CLOUDINATY_IMAGES_FOLDER = 'product-images';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imagesService: ImagesService,
  ) {}

  async getProducts(
    getProductsInput: GetProductsInput,
  ): Promise<GetProductsResponse> {
    const { page, pageSize, categoryId } = getProductsInput;

    const currentPage = Math.max(1, page || 1);
    const limit = Math.max(1, pageSize || 10);
    const skip = (currentPage - 1) * limit;

    const products = await this.prismaService.product.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
      },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'asc' },
      include: {
        category: true,
        images: true,
      },
    });

    const totalItems = await this.prismaService.product.count({
      where: {
        ...(categoryId ? { categoryId } : {}),
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: products,
      totalPages,
      currentPage,
    };
  }

  async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<ProductModel> {
    const uploadedImages: UploadImageResponseResponse[] = [];
    const { images } = createProductInput;

    const formattedImages = images?.map((image) => ({
      fileBuffer: image.fileBuffer,
      folder: CLOUDINATY_IMAGES_FOLDER,
    }));

    if (formattedImages) {
      for (const image of formattedImages) {
        const uploadResult = await this.imagesService.uploadImage({
          fileBuffer: image.fileBuffer,
          folder: image.folder,
        });

        uploadedImages.push({
          publicId: uploadResult.publicId,
          url: uploadResult.url,
        });
      }
    }

    return this.prismaService.product.create({
      data: {
        ...createProductInput,
        images: {
          create: uploadedImages.map((image) => ({
            url: image.url,
            cloudinaryPublicId: image.publicId,
          })),
        },
      },
      include: {
        images: true,
      },
    });
  }

  async addImagesToProduct(
    productIdDto: IdDto,
    uploadProductImageInput: UploadProductImageInput[],
  ): Promise<ProductModel> {
    const { id: productId } = productIdDto;
    const product = await this.prismaService.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const uploadedImages: UploadImageResponseResponse[] = [];

    const formattedImages = uploadProductImageInput?.map((image) => ({
      fileBuffer: image.fileBuffer,
      folder: CLOUDINATY_IMAGES_FOLDER,
    }));

    for (const image of formattedImages) {
      const uploadResult = await this.imagesService.uploadImage({
        fileBuffer: image.fileBuffer,
        folder: image.folder || 'products',
      });

      uploadedImages.push({
        publicId: uploadResult.publicId,
        url: uploadResult.url,
      });
    }

    const formattedImageInput = uploadedImages.map((imageData) => {
      return {
        url: imageData.url,
        cloudinaryPublicId: imageData.publicId,
        productId,
      };
    });

    await this.prismaService.productImage.createMany({
      data: formattedImageInput,
    });

    return await this.prismaService.product.findFirst({
      where: { id: productId },
      include: { images: true },
    });
  }

  async removeImageFromProduct(
    productIdDto: IdDto,
    imageIdDto: IdDto,
  ): Promise<boolean> {
    const { id: productId } = productIdDto;
    const { id: imageId } = imageIdDto;

    const productImage = await this.prismaService.productImage.findFirst({
      where: { productId: productId, id: imageId },
    });

    if (!productImage) {
      throw new NotFoundException();
    }

    await this.imagesService.deleteImage({
      publicId: productImage.cloudinaryPublicId,
    });

    await this.prismaService.productImage.delete({ where: { id: imageId } });
    return true;
  }

  async deleteProduct(productIdDto: IdDto): Promise<boolean> {
    const { id: productId } = productIdDto;

    await this.getProductById(productIdDto);

    const productImages = await this.prismaService.productImage.findMany({
      where: { productId },
    });

    await Promise.all(
      productImages.map((image) =>
        this.imagesService.deleteImage({
          publicId: image.cloudinaryPublicId,
        }),
      ),
    );

    await this.prismaService.productImage.deleteMany({ where: { productId } });
    await this.prismaService.product.delete({ where: { id: productId } });

    return true;
  }

  async getProductById(productIdDto: IdDto) {
    const { id: productId } = productIdDto;
    const product = await this.prismaService.product.findFirst({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateProductDetails(
    productIdDto: IdDto,
    updateProductInput: UpdateProductInput,
  ): Promise<ProductModel> {
    const { id: productId } = productIdDto;
    await this.getProductById(productIdDto);

    return this.prismaService.product.update({
      where: { id: productId },
      data: updateProductInput,
      include: { images: true },
    });
  }

  async updateProductStatus(
    productIdDto: IdDto,
    updateProductStatusdInput: UpdateProductStatusInput,
  ): Promise<ProductModel> {
    await this.getProductById(productIdDto);
    const { id: productId } = productIdDto;
    const { isDisabled } = updateProductStatusdInput;

    return this.prismaService.product.update({
      where: { id: productId },
      data: { isDisabled },
      include: { images: true },
    });
  }
}
