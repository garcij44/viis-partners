/**
 * Outbound mail. Azure Communication Services in production; a transport
 * that writes the envelope to the function log for local development, so
 * the whole flow runs without a mail account.
 */
import { EmailClient } from '@azure/communication-email';

export interface Message {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export type LogLine = (line: string) => void;

export interface Mailer {
  send(message: Message, log: LogLine): Promise<void>;
}

export class AcsMailer implements Mailer {
  private readonly client: EmailClient;

  constructor(
    connectionString: string,
    private readonly from: string,
  ) {
    this.client = new EmailClient(connectionString);
  }

  /**
   * beginSend resolves once ACS has accepted the message (202). The
   * delivery poll is not awaited: a queued message survives this
   * invocation ending, and waiting would hold the visitor's request.
   */
  async send(message: Message): Promise<void> {
    await this.client.beginSend({
      senderAddress: this.from,
      recipients: { to: [{ address: message.to }] },
      replyTo: message.replyTo ? [{ address: message.replyTo }] : undefined,
      content: { subject: message.subject, plainText: message.text, html: message.html },
    });
  }
}

export class LogMailer implements Mailer {
  async send(message: Message, log: LogLine): Promise<void> {
    log(
      JSON.stringify({
        event: 'mail.logged',
        to: message.to,
        replyTo: message.replyTo ?? null,
        subject: message.subject,
        text: message.text,
      }),
    );
  }
}
