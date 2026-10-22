import type {
  Environment,
  Language,
  PreferenceStore,
  PreferencesApplication,
  Theme,
} from '../domain/contracts';
import { detectLanguage } from './detect-language';

export class PreferenceService implements PreferencesApplication {
  constructor(
    private readonly store: PreferenceStore,
    private readonly environment: Environment,
  ) {}
  load(): { language: Language; theme: Theme } {
    const language = this.store.get('portfolio.language');
    const theme = this.store.get('portfolio.theme');
    return {
      language:
        language === 'pt-BR' || language === 'en'
          ? language
          : detectLanguage(this.environment.language),
      theme:
        theme === 'light' || theme === 'dark'
          ? theme
          : this.environment.prefersDark()
            ? 'dark'
            : 'light',
    };
  }
  saveLanguage(language: Language): void {
    this.store.set('portfolio.language', language);
  }
  saveTheme(theme: Theme): void {
    this.store.set('portfolio.theme', theme);
  }
}
