import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class DbFilter<T> extends BaseExceptionFilter<T> {
  catch(exception: T, host: ArgumentsHost) {
    console.error(JSON.stringify({ exception }, null, 2));
    super.catch(exception, host);
  }
}
