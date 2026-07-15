import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { prisma } from '@djob/database';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se a rota não for autenticada ou não houver usuário, segue normalmente
    if (!user || !user.tenantId) {
      return next.handle();
    }

    if (user.role === 'SUPER_ADMIN') {
      return next.handle();
    }

    // Injetamos um PrismaClient transacional que possui RLS configurado
    // O service deverá usar o request.prisma ao invés da instância global
    request.prisma = prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SET app.current_tenant = ${user.tenantId}`,
              query(args),
            ]);
            return result;
          },
        },
      },
    });

    return next.handle();
  }
}
