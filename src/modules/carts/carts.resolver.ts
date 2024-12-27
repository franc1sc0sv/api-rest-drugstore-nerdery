import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './carts.service';
import { CartDto } from 'src/common/dtos/cart.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { AddItemToCartInput } from './dtos/request/add-item-to-cart.input';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/dtos/user.dto';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartDto)
  @UseGuards(GqlAuthGuard)
  async getCart(@CurrentUser() user: UserDto): Promise<CartDto> {
    return this.cartService.findCartByUserId(user);
  }

  @Mutation(() => CartDto)
  @UseGuards(GqlAuthGuard)
  async addItemToCart(
    @Args('addItemToCartInput') addItemToCartInput: AddItemToCartInput,
    @CurrentUser() user: UserDto,
  ): Promise<CartDto> {
    return this.cartService.addItemToCart(addItemToCartInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeCartItem(
    @Args('cartIdDto') cartIdDto: IdDto,
    @CurrentUser() user: UserDto,
  ): Promise<boolean> {
    return this.cartService.removeCartItem(cartIdDto, user);
  }
}
