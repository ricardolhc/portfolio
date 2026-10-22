import { Registry } from './core/di/registry';
import { TOKENS } from './application/tokens';
import { ContactService, composeContact } from './application/contact-service';
import { PreferenceService } from './application/preference-service';
import {
  BrowserPreferences,
  BrowserClipboard,
  BrowserMailClient,
  browserEnvironment,
} from './infrastructure/browser';

export function createRegistry(): Registry {
  return new Registry()
    .register(TOKENS.store, () => new BrowserPreferences())
    .register(TOKENS.environment, () => browserEnvironment)
    .register(TOKENS.mail, () => new BrowserMailClient())
    .register(TOKENS.clipboard, () => new BrowserClipboard())
    .register(TOKENS.composer, () => ({ compose: composeContact }))
    .register(
      TOKENS.preferences,
      (r) =>
        new PreferenceService(
          r.resolve(TOKENS.store),
          r.resolve(TOKENS.environment),
        ),
    )
    .register(
      TOKENS.contact,
      (r) =>
        new ContactService(
          r.resolve(TOKENS.composer),
          r.resolve(TOKENS.mail),
          r.resolve(TOKENS.clipboard),
        ),
    );
}
