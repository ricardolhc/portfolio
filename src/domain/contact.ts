import type { ContactData } from './contracts';

export const CONTACT_EMAIL = 'contato.ricardolhc@gmail.com';
export type ContactField = keyof ContactData;
export type ValidationCode =
  'required' | 'short' | 'long' | 'email' | 'singleLine';
export type ContactErrors = Partial<Record<ContactField, ValidationCode>>;
export const CONTACT_LIMITS = {
  name: [2, 100],
  email: [1, 254],
  subject: [3, 160],
  message: [10, 5000],
} as const;
export const CONTACT_FIELDS: ContactField[] = [
  'name',
  'email',
  'subject',
  'message',
];

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const value = data[field].trim();
    const [min, max] = CONTACT_LIMITS[field];
    if (!value) errors[field] = 'required';
    else if (value.length < min) errors[field] = 'short';
    else if (value.length > max) errors[field] = 'long';
    else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors[field] = 'email';
    else if ((field === 'name' || field === 'subject') && /[\r\n]/.test(value))
      errors[field] = 'singleLine';
  }
  return errors;
}
