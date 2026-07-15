import { Module } from '@nestjs/common';

import { PasswordResetMailService } from './password-reset-mail.service';

@Module({
  providers: [PasswordResetMailService],
  exports: [PasswordResetMailService],
})
export class MailModule {}
