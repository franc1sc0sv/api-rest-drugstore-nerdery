import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { IdDto } from 'src/common/models/id.dto.model';
import { LikeDto } from 'src/common/models/like.dto.model';
import { UserDto } from 'src/common/models/user.model';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async likeProduct(productIdDto: IdDto, user: UserDto): Promise<LikeDto> {
    const { id: productId } = productIdDto;
    const { id: userId } = user;

    const existingLike = await this.prismaService.like.findFirst({
      where: { productId, userId },
    });

    if (existingLike) {
      throw new Error('User has already liked this product');
    }

    const newLike = await this.prismaService.like.create({
      data: {
        productId,
        userId,
      },
      include: { product: true },
    });

    return newLike;
  }

  async deleteLike(productIdDto: IdDto, user: UserDto): Promise<boolean> {
    const { id: productId } = productIdDto;
    const { id: userId } = user;

    const existingLike = await this.prismaService.like.findFirst({
      where: { productId, userId },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    await this.prismaService.like.delete({
      where: { id: existingLike.id },
    });

    return true;
  }

  async getUserLikes(user: UserDto): Promise<LikeDto[]> {
    const { id: userId } = user;

    const likes = await this.prismaService.like.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!likes || likes.length === 0) {
      throw new NotFoundException('No likes found for the user');
    }

    return likes;
  }
}
