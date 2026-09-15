import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.port.js';
import {
  NOTIFICATION_RECIPIENT_RESOLVER,
  type NotificationRecipientResolver,
} from '../../application/ports/notification-recipient.port.js';
import {
  MAILER,
  type MailerPort,
} from '../../../notification/application/ports/mailer.port.js';

@Injectable()
export class EmailNotificationAdapter implements NotificationPort {
  constructor(
    @Inject(NOTIFICATION_RECIPIENT_RESOLVER)
    private readonly notificationRecipientResolver: NotificationRecipientResolver,
    @Inject(MAILER) private readonly mailer: MailerPort,
  ) {}

  async sendNotification(notification: Notification): Promise<void> {
    const { email } = await this.notificationRecipientResolver.resolve(
      notification.recipientId,
    );

    await this.mailer.send(email, notification.subject, notification.message);
  }
}
