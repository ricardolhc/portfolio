import { createToken } from '../core/di/registry';
import type {
  PreferencesApplication,
  PreferenceStore,
  Environment,
  ClipboardPort,
  ContactGateway,
} from '../domain/contracts';

export const TOKENS = {
  preferences: createToken<PreferencesApplication>('preferences'),
  store: createToken<PreferenceStore>('preferenceStore'),
  environment: createToken<Environment>('environment'),
  clipboard: createToken<ClipboardPort>('clipboard'),
  contactGateway: createToken<ContactGateway>('contactGateway'),
};
