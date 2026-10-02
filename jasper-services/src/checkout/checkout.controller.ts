import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartToken } from '../common/decorators/cart-token.decorator';
import { CheckoutService } from './checkout.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('quote')
  quote(@CartToken() cartToken?: string) {
    return this.checkoutService.quote(cartToken);
  }

  @Post('session')
  createCheckoutSession(
    @CartToken() cartToken: string | undefined,
    @Body() dto: CreateSessionDto,
  ) {
    return this.checkoutService.createCheckoutSession(cartToken, dto);
  }

  @Get('session/:sessionId')
  getCheckoutSession(@Param('sessionId') sessionId: string) {
    return this.checkoutService.getCheckoutSession(sessionId);
  }
}
