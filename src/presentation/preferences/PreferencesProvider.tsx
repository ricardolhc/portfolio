import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useInject } from '../../core/di/inject';
import { TOKENS } from '../../application/tokens';
import type { Language, Theme } from '../../domain/contracts';
import { messages } from '../i18n/messages';

interface Preferences {
  language: Language;
  theme: Theme;
  t: (typeof messages)['pt-BR'];
  setLanguage(language: Language): void;
  toggleTheme(): void;
}
const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const service = useInject(TOKENS.preferences);
  const [preferences, setPreferences] = useState(() => service.load());
  const { language, theme } = preferences;
  const t = messages[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.meta.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', t.meta.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', t.meta.description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', language === 'en' ? 'en_US' : 'pt_BR');
  }, [language, t]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#141414' : '#f7f7f4');
  }, [theme]);

  const setLanguage = (next: Language) => {
    service.saveLanguage(next);
    setPreferences((current) => ({ ...current, language: next }));
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    service.saveTheme(next);
    setPreferences((current) => ({ ...current, theme: next }));
  };

  return (
    <PreferencesContext.Provider
      value={{ language, theme, t, setLanguage, toggleTheme }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  const context = useContext(PreferencesContext);

  if (!context) throw new Error('usePreferences requires PreferencesProvider');

  return context;
}
