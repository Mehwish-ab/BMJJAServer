import {
  ArgumentsHost,
  Catch,
  BadRequestException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
