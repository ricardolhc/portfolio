import { CONTACT_EMAIL } from '../domain/contact';

export function createEmailLink(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
