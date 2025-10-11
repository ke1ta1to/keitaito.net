import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export const Auth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // @ts-expect-error: custom property
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.auth;
  },
);
