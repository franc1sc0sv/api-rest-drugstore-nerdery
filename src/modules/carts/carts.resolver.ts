import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { CartModel } from 'src/common/models/cart.model';
import { IdDto } from 'src/common/dtos/id.dto';
import { AddItemToCartInput } from './dtos/request/add-item-to-cart.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserModel } from 'src/common/models/user.model';
import { TotalCart } from './dtos/response/total-cart.dto';
import { UnifiedAuthGuard } from 'src/common/guards/unified-auth.guard';

@Resolver()
export class CartsResolver {
  constructor(private readonly cartService: CartsService) {}

  @Query(() => CartModel)
  @UseGuards(UnifiedAuthGuard)
  async getCart(@CurrentUser() user: UserModel): Promise<CartModel> {
    return await this.cartService.findCartByUserId(user);
  }

  @Mutation(() => CartModel)
  @UseGuards(UnifiedAuthGuard)
  async addItemToCart(
    @Args('addItemToCartInput') addItemToCartInput: AddItemToCartInput,
    @CurrentUser() user: UserModel,
  ): Promise<CartModel> {
    return await this.cartService.addItemToCart(addItemToCartInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(UnifiedAuthGuard)
  async removeCartItem(
    @Args('cartItemIdDto') cartItemIdDto: IdDto,
    @CurrentUser() user: UserModel,
  ): Promise<boolean> {
    return await this.cartService.removeCartItem(cartItemIdDto, user);
  }

  @Mutation(() => TotalCart)
  @UseGuards(UnifiedAuthGuard)
  async calculateTotal(@CurrentUser() user: UserModel): Promise<TotalCart> {
    return await this.cartService.calculateTotal(user);
  }
}
