import type {
  ClipboardPort,
  ContactApplication,
  ContactData,
  MailClient,
  MailLabels,
  MessageComposer,
  PreparedMessage,
} from '../domain/contracts';
import { CONTACT_EMAIL, validateContact } from '../domain/contact';

export function composeContact(
  data: ContactData,
  labels: MailLabels,
): PreparedMessage {
  const subject = data.subject.trim();
  const body = `${labels.name}: ${data.name.trim()}\n${labels.email}: ${data.email.trim()}\n\n${labels.message}:\n${data.message.trim()}`;
  return {
    subject,
    body,
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export class ContactService implements ContactApplication {
  constructor(
    private readonly composer: MessageComposer,
    private readonly mail: MailClient,
    private readonly clipboard: ClipboardPort,
  ) {}
  prepare(data: ContactData, labels: MailLabels): PreparedMessage {
    if (Object.keys(validateContact(data)).length > 0)
      throw new Error('Invalid contact data');
    return this.composer.compose(data, labels);
  }
  open(url: string): void {
    this.mail.open(url);
  }
  copy(text: string): Promise<void> {
    return this.clipboard.write(text);
  }
}
