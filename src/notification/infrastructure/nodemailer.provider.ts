import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

export const MAIL_TRANSPORT = Symbol('MAIL_TRANSPORT');

export const NodemailerTransportProvider: Provider = {
  provide: MAIL_TRANSPORT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const transporter = nodemailer.createTransport({
      host: configService.getOrThrow<string>('SMTP_HOST'),
      port: Number(configService.getOrThrow<string>('SMTP_PORT')),
      secure: configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: configService.getOrThrow<string>('SMTP_USER'),
        pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    await transporter.verify();

    return transporter;
  },
};
