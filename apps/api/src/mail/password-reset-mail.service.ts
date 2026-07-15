import { Injectable } from '@nestjs/common';

export interface PasswordResetMail {
  recipient: string;
  recipientName: string;
  resetUrl: string;
}

export interface PasswordResetMailer {
  isConfigured(): boolean;
  sendPasswordReset(message: PasswordResetMail): Promise<void>;
}

@Injectable()
export class PasswordResetMailService implements PasswordResetMailer {
  isConfigured(): boolean {
    return false;
  }

  async sendPasswordReset(_message: PasswordResetMail): Promise<void> {
    throw new Error('O provedor de e-mail para recuperação de senha não está configurado.');
  }
}
