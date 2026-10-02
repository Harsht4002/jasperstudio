import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CartTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    request.headers['x-cart-token'] =
      request.header('x-cart-token') ?? request.cookies?.cart_token;
    return true;
  }
}
