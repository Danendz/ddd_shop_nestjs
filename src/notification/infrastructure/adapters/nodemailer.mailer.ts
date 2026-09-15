import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerPort } from '../../application/ports/mailer.port.js';
import { MAIL_TRANSPORT } from '../nodemailer.provider.js';
import type { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerMailer implements MailerPort {
  private readonly logger = new Logger(NodemailerMailer.name);
  private readonly from: string;

  constructor(
    @Inject(MAIL_TRANSPORT)
    private readonly transporter: Transporter,
    configService: ConfigService,
  ) {
    this.from = configService.getOrThrow<string>('SMTP_FROM');
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text: body,
    });

    this.logger.log(`Sent "${subject}" to "${to}" (${info.messageId})`);
  }
}
