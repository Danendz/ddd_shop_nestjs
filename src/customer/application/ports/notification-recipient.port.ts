export const NOTIFICATION_RECIPIENT_RESOLVER = Symbol(
  'NOTIFICATION_RECIPIENT_RESOLVER',
);

export interface RecipientContact {
  email: string;
  phone: string | null;
}

export interface NotificationRecipientResolver {
  resolve(recipientId: string): Promise<RecipientContact>;
}
