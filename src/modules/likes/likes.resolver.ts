import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { UseGuards } from '@nestjs/common';
import { LikeModel } from 'src/common/models/like.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserModel } from 'src/common/models/user.model';
import { IdDto } from 'src/common/dtos/id.dto';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';

@Resolver()
export class LikesResolver {
  constructor(private readonly likeService: LikesService) {}

  @Query(() => [LikeModel])
  @UseGuards(GqlAuthGuard)
  async getUserLikes(@CurrentUser() user: UserModel): Promise<LikeModel[]> {
    return this.likeService.getUserLikes(user);
  }

  @Mutation(() => LikeModel)
  async likeProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserModel,
  ): Promise<LikeModel> {
    return this.likeService.likeProduct(productIdDto, user);
  }

  @Mutation(() => Boolean)
  async deleteLike(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserModel,
  ): Promise<boolean> {
    return this.likeService.deleteLike(productIdDto, user);
  }
}
