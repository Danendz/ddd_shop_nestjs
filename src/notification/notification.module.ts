import { Module } from '@nestjs/common';
import { NodemailerTransportProvider } from './infrastructure/nodemailer.provider.js';
import { MAILER } from './application/ports/mailer.port.js';
import { NodemailerMailer } from './infrastructure/adapters/nodemailer.mailer.js';

@Module({
  providers: [
    NodemailerTransportProvider,
    {
      provide: MAILER,
      useClass: NodemailerMailer,
    },
  ],
  exports: [MAILER],
})
export class NotificationModule {}
