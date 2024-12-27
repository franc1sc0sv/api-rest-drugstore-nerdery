import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikeService } from './likes.service';
import { UseGuards } from '@nestjs/common';
import { LikeDto } from 'src/common/dtos/like.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/dtos/user.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';

@Resolver()
export class LikesResolver {
  constructor(private readonly likeService: LikeService) {}

  @Query(() => [LikeDto])
  @UseGuards(GqlAuthGuard)
  async getUserLikes(@CurrentUser() user: UserDto): Promise<LikeDto[]> {
    return this.likeService.getUserLikes(user);
  }

  @Mutation(() => LikeDto)
  async likeProduct(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserDto,
  ): Promise<LikeDto> {
    return this.likeService.likeProduct(productIdDto, user);
  }

  @Mutation(() => Boolean)
  async deleteLike(
    @Args('productIdDto') productIdDto: IdDto,
    @CurrentUser() user: UserDto,
  ): Promise<boolean> {
    return this.likeService.deleteLike(productIdDto, user);
  }
}
