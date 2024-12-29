import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { CartDto } from 'src/common/dtos/cart.dto';
import { IdDto } from 'src/common/dtos/id.dto';
import { AddItemToCartInput } from './dtos/request/add-item-to-cart.input';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/dtos/user.dto';
import { TotalCart } from './dtos/response/total-cart.dto';

@Resolver()
export class CartsResolver {
  constructor(private readonly cartService: CartsService) {}

  @Query(() => CartDto)
  @UseGuards(GqlAuthGuard)
  async getCart(@CurrentUser() user: UserDto): Promise<CartDto> {
    return await this.cartService.findCartByUserId(user);
  }

  @Mutation(() => CartDto)
  @UseGuards(GqlAuthGuard)
  async addItemToCart(
    @Args('addItemToCartInput') addItemToCartInput: AddItemToCartInput,
    @CurrentUser() user: UserDto,
  ): Promise<CartDto> {
    return await this.cartService.addItemToCart(addItemToCartInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeCartItem(
    @Args('cartIdDto') cartIdDto: IdDto,
    @CurrentUser() user: UserDto,
  ): Promise<boolean> {
    return await this.cartService.removeCartItem(cartIdDto, user);
  }

  @Mutation(() => TotalCart)
  @UseGuards(GqlAuthGuard)
  async calculateTotal(@CurrentUser() user: UserDto): Promise<TotalCart> {
    return await this.cartService.calculateTotal(user);
  }
}
