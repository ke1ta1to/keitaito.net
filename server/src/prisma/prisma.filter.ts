import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

import { Prisma } from '@/generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        const statusCode = HttpStatus.CONFLICT;
        response.status(statusCode).json({ statusCode, message });
        break;
      }

      case 'P2025': {
        const statusCode = HttpStatus.NOT_FOUND;
        response.status(statusCode).json({ statusCode, message });
        break;
      }

      default: {
        super.catch(exception, host);
        break;
      }
    }
  }
}
