import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { UseGuards } from '@nestjs/common';
import { LikeModel } from 'src/common/models/like.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserModel } from 'src/common/models/user.model';
import { IdDto } from 'src/common/dtos/id.dto';
import { UnifiedAuthGuard } from 'src/common/guards/unified-auth.guard';
import { ProductLoader } from '../loaders/product/product-loader/product.loader';
import { ProductModel } from 'src/common/models/product.model';

@Resolver(() => LikeModel)
export class LikesResolver {
  constructor(
    private readonly likeService: LikesService,
    private readonly productLoader: ProductLoader,
  ) {}

  @Query(() => [LikeModel])
  @UseGuards(UnifiedAuthGuard)
  async getUserLikes(@CurrentUser() user: UserModel): Promise<LikeModel[]> {
    return this.likeService.getUserLikes(user);
  }

  @Mutation(() => LikeModel)
  @UseGuards(UnifiedAuthGuard)
  async likeProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserModel,
  ): Promise<LikeModel> {
    return this.likeService.likeProduct(productIdDto, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(UnifiedAuthGuard)
  async deleteLike(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserModel,
  ): Promise<boolean> {
    return this.likeService.deleteLike(productIdDto, user);
  }

  @ResolveField(() => ProductModel)
  async product(@Parent() like: LikeModel): Promise<ProductModel> {
    const { productId } = like;
    return this.productLoader.batchProducts.load(productId);
  }
}
