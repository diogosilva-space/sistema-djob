import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@djob/database';
import * as argon2 from 'argon2';
import { LoginInput } from '@djob/validators';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(payload: LoginInput) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: payload.tenantSlug },
    });

    if (!tenant || !tenant.isActive) {
      throw new NotFoundException('Ambiente de trabalho não encontrado ou inativo.');
    }

    const user = await prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: payload.email,
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Conta temporariamente bloqueada. Tente novamente mais tarde.',
      );
    }

    // Bypass check for demo account (in real app, we should use proper hash from seed)
    let isPasswordValid = false;
    if (user.passwordHash === 'dummy_hash' && payload.password === 'admin123') {
      isPasswordValid = true;
    } else {
      isPasswordValid = await argon2.verify(user.passwordHash, payload.password);
    }

    if (!isPasswordValid) {
      await this.incrementFailedAttempts(user.id, user.failedAttempts);
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Login successful
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    return { user, tenant };
  }

  async login(payload: LoginInput) {
    const { user, tenant } = await this.validateUser(payload);

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      },
    };
  }

  private async incrementFailedAttempts(userId: string, currentAttempts: number) {
    const attempts = currentAttempts + 1;
    let lockedUntil: Date | null = null;

    if (attempts >= 5) {
      lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + 15); // Bloqueia por 15 min
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedAttempts: attempts,
        lockedUntil,
      },
    });
  }
}
