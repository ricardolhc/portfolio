import { usePreferences } from '../preferences/PreferencesProvider';
import { Icon } from './Icon';

export function ThemeToggle() {
  const { theme, toggleTheme, t } = usePreferences();
  return (
    <button
      className="icon-button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? t.controls.dark : t.controls.light}
    >
      <Icon name={theme === 'light' ? 'moon' : 'sun'} />
    </button>
  );
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = usePreferences();
  return (
    <button
      className="language-button"
      onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
      aria-label={t.controls.language}
    >
      <span
        lang="pt-BR"
        className={language === 'pt-BR' ? 'selected-language' : ''}
      >
        PT
      </span>
      <span aria-hidden="true" className="language-divider">
        /
      </span>
      <span lang="en" className={language === 'en' ? 'selected-language' : ''}>
        EN
      </span>
    </button>
  );
}
