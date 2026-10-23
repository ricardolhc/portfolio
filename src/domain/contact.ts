import type { ContactMessage } from './contracts';

export const CONTACT_EMAIL = 'contato.ricardolhc@gmail.com';
export const CONTACT_FIELDS = ['name', 'email', 'subject', 'message'] as const;
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  subject: 160,
  message: 5000,
} as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactErrors = Partial<
  Record<ContactField, 'required' | 'tooLong' | 'invalidEmail' | 'singleLine'>
>;

export function normalizeContact(message: ContactMessage): ContactMessage {
  return {
    name: message.name.trim(),
    email: message.email.trim(),
    subject: message.subject.trim(),
    message: message.message.trim(),
  };
}

export function validateContact(message: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};

  for (const field of CONTACT_FIELDS) {
    const value = message[field].trim();

    if (!value) errors[field] = 'required';
    else if (value.length > CONTACT_LIMITS[field]) errors[field] = 'tooLong';
    else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors[field] = 'invalidEmail';
    else if ((field === 'name' || field === 'subject') && /[\r\n]/.test(value))
      errors[field] = 'singleLine';
  }

  return errors;
}

export class ContactGatewayError extends Error {
  constructor(readonly code: 'unavailable' | 'rateLimited') {
    super('Contact request failed');
  }
}
