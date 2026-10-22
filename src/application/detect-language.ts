import type { Language } from '../domain/contracts';

export function detectLanguage(browserLanguage: string): Language {
  const primary = browserLanguage.toLowerCase().split('-')[0];
  return primary === 'en' ? 'en' : 'pt-BR';
}
