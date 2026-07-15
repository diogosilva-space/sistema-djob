import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (user?.role === 'SUPER_ADMIN') {
      if (requiredRoles?.includes('SUPER_ADMIN')) {
        return true;
      }

      throw new ForbiddenException('Super Admin não tem acesso a rotas operacionais.');
    }

    if (!requiredRoles) {
      return true;
    }

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado. Perfil insuficiente.');
    }

    return true;
  }
}
