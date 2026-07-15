import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('Exception caught by filter:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && (res as any).message) {
        message = (res as any).message;
      } else if (typeof res === 'string') {
        message = res;
      }

      // Tradução de mensagens padrão APENAS se a mensagem for a padrão do NestJS
      if (message === 'Unauthorized') {
        message = 'Acesso não autorizado.';
      } else if (message === 'Forbidden resource') {
        message = 'Você não tem permissão para acessar este recurso.';
      } else if (message.includes('Cannot GET') || message.includes('Cannot POST')) {
        message = 'Recurso não encontrado.';
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
