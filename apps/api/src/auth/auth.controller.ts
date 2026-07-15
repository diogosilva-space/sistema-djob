import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  loginSchema,
  LoginInput,
  passwordResetConfirmSchema,
  PasswordResetConfirmInput,
  passwordResetRequestSchema,
  PasswordResetRequestInput,
} from '@djob/validators';

const PASSWORD_RESET_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticação de usuário por tenant' })
  @ApiResponse({ status: 200, description: 'Login bem sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiResponse({ status: 404, description: 'Tenant não encontrado.' })
  async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginInput) {
    return this.authService.login(body);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @Throttle(PASSWORD_RESET_THROTTLE)
  @ApiOperation({ summary: 'Solicita instruções para recuperação de senha' })
  @ApiResponse({ status: 200, description: 'Solicitação processada.' })
  @ApiResponse({ status: 503, description: 'Entrega de e-mail indisponível.' })
  async requestPasswordReset(
    @Body(new ZodValidationPipe(passwordResetRequestSchema)) body: PasswordResetRequestInput,
  ) {
    return this.authService.requestPasswordReset(body);
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  @Throttle(PASSWORD_RESET_THROTTLE)
  @ApiOperation({ summary: 'Redefine a senha por token de recuperação' })
  @ApiResponse({ status: 200, description: 'Senha redefinida.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  async confirmPasswordReset(
    @Body(new ZodValidationPipe(passwordResetConfirmSchema)) body: PasswordResetConfirmInput,
  ) {
    return this.authService.confirmPasswordReset(body);
  }
}
