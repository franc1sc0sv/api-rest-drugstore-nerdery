import { Injectable, NotFoundException } from '@nestjs/common';

import { ImagesService } from '../images/images.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductInput } from './dtos/request/create-products.input';
import { ProductResponse } from './dtos/response/product-reponse.dto';
import { UploadImageResponseDto } from '../images/dtos/response/upload-image.dto';

import { IdDto } from 'src/common/dtos/id.dto';
import { UploadProductImageInput } from './dtos/request/upload-product-images.input';

const CLOUDINATY_IMAGES_FOLDER = 'product-images';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imagesService: ImagesService,
  ) {}

  async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<ProductResponse> {
    const uploadedImages: UploadImageResponseDto[] = [];
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
  ): Promise<ProductResponse> {
    const { id: productId } = productIdDto;
    const product = await this.prismaService.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const uploadedImages: UploadImageResponseDto[] = [];

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

  async updateProductDetails() {}

  async deleteProduct() {}

  async updateProductStatus() {}
}
