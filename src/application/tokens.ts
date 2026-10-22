import { createToken } from '../core/di/registry';
import type {
  ContactApplication,
  PreferencesApplication,
  PreferenceStore,
  Environment,
  MailClient,
  ClipboardPort,
  MessageComposer,
} from '../domain/contracts';

export const TOKENS = {
  contact: createToken<ContactApplication>('contact'),
  preferences: createToken<PreferencesApplication>('preferences'),
  store: createToken<PreferenceStore>('preferenceStore'),
  environment: createToken<Environment>('environment'),
  mail: createToken<MailClient>('mailClient'),
  clipboard: createToken<ClipboardPort>('clipboard'),
  composer: createToken<MessageComposer>('messageComposer'),
};
