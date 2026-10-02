import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CartToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const header = request.header('x-cart-token');
    return header ?? request.cookies?.cart_token;
  },
);
