import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentAdmin = {
  adminUserId: string;
  email: string;
  role: string;
};

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdmin | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: CurrentAdmin }>();
    return request.user;
  },
);
