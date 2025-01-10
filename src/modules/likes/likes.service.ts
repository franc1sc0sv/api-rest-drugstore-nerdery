import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { IdDto } from 'src/common/dtos/id.dto';
import { LikeModel } from 'src/common/models/like.model';
import { UserModel } from 'src/common/models/user.model';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async likeProduct(productIdDto: IdDto, user: UserModel): Promise<LikeModel> {
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
    });

    return newLike;
  }

  async deleteLike(productIdDto: IdDto, user: UserModel): Promise<boolean> {
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

  async getUserLikes(user: UserModel): Promise<LikeModel[]> {
    const { id: userId } = user;

    const likes = await this.prismaService.like.findMany({
      where: {
        userId,
      },
    });

    if (!likes || likes.length === 0) {
      throw new NotFoundException('No likes found for the user');
    }

    return likes;
  }
}
