import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { UseGuards } from '@nestjs/common';
import { LikeDto } from 'src/common/models/like.dto.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/models/user.model';
import { IdDto } from 'src/common/models/id.dto.model';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';

@Resolver()
export class LikesResolver {
  constructor(private readonly likeService: LikesService) {}

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
