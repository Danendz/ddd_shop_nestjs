export const MAILER = Symbol('MAILER');

export interface MailerPort {
  send(to: string, subject: string, body: string): Promise<void>;
}
