import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const callback = host.getArgByIndex(2);
    if (callback && typeof callback === 'function') {
      return callback({
        success: false,
        message: exception?.message,
        ...(exception?.error?.errors ? { errors: exception?.error?.errors } : {}),
      });
    }

    super.catch(exception, host);
  }
}
