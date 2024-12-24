import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const path = info?.path?.key || null;
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return {
        errors: [
          {
            message:
              typeof response === 'string'
                ? response
                : response['message'] || 'Internal server error',
            error: response['error'] || exception.name,
            statusCode: status,
            path,
            timestamp,
          },
        ],
      };
    }

    console.error('Unhandled exception:', exception);

    return {
      errors: [
        {
          message: 'An unexpected error occurred',
          error: 'InternalServerError',
          statusCode: 500,
          path,
          timestamp,
        },
      ],
    };
  }
}
