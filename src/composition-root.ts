import { Registry } from './core/di/registry';
import { TOKENS } from './application/tokens';
import { PreferenceService } from './application/preference-service';
import {
  BrowserPreferences,
  BrowserClipboard,
  browserEnvironment,
} from './infrastructure/browser';

export function createRegistry(): Registry {
  return new Registry()
    .register(TOKENS.store, () => new BrowserPreferences())
    .register(TOKENS.environment, () => browserEnvironment)
    .register(TOKENS.clipboard, () => new BrowserClipboard())
    .register(
      TOKENS.preferences,
      (r) =>
        new PreferenceService(
          r.resolve(TOKENS.store),
          r.resolve(TOKENS.environment),
        ),
    );
}
