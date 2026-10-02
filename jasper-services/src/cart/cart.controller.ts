import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CartToken } from '../common/decorators/cart-token.decorator';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async find(
    @CartToken() cartToken: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cart = await this.cartService.find(cartToken);
    this.setCartTokenHeader(response, cart.cartToken);
    return cart;
  }

  @Post('items')
  async addItem(
    @CartToken() cartToken: string | undefined,
    @Body() dto: AddCartItemDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cart = await this.cartService.addItem(cartToken, dto);
    this.setCartTokenHeader(response, cart.cartToken);
    return cart;
  }

  @Patch('items/:itemId')
  async updateItem(
    @CartToken() cartToken: string | undefined,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cart = await this.cartService.updateItem(cartToken, itemId, dto);
    this.setCartTokenHeader(response, cart.cartToken);
    return cart;
  }

  @Delete('items/:itemId')
  async removeItem(
    @CartToken() cartToken: string | undefined,
    @Param('itemId') itemId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cart = await this.cartService.removeItem(cartToken, itemId);
    this.setCartTokenHeader(response, cart.cartToken);
    return cart;
  }

  @Delete()
  clear(@CartToken() cartToken?: string) {
    return this.cartService.clear(cartToken);
  }

  private setCartTokenHeader(response: Response, cartToken?: string | null) {
    if (cartToken) {
      response.setHeader('X-Cart-Token', cartToken);
    }
  }
}
