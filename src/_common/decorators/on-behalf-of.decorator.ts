import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Returns user id on whose behalf the request is being made
 *
 * @example
 * .@Get()
 * async find(@OnBehalfOf() userId?: string) {}
 */
export const OnBehalfOf = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['on-behalf-of'];
  }
);
