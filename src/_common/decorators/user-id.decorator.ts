import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const X_USER_ID = 'x-user-id';

/**
 * Returns user id on whose behalf the request is being made
 *
 * @example
 * .@Get()
 * async find(@UserId() userId?: string) {}
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[X_USER_ID];
  }
);
