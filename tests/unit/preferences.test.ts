import { describe, expect, it, vi } from 'vitest';
import { detectLanguage } from '../../src/application/detect-language';
import { PreferenceService } from '../../src/application/preference-service';
import {
  BrowserPreferences,
  BrowserClipboard,
  browserEnvironment,
} from '../../src/infrastructure/browser';

describe('language detection', () => {
  it.each([
    ['pt-BR', 'pt-BR'],
    ['pt', 'pt-BR'],
    ['PT-pt', 'pt-BR'],
    ['en-US', 'en'],
    ['EN', 'en'],
    ['en-GB', 'en'],
    ['fr', 'pt-BR'],
    ['', 'pt-BR'],
    ['english', 'pt-BR'],
    ['ptfake', 'pt-BR'],
  ])('detects %s as %s', (input, expected) =>
    expect(detectLanguage(input)).toBe(expected),
  );
});
describe('preference service', () => {
  it('prioritizes valid saved preferences and uses namespaced keys', () => {
    const get = vi.fn((key: string) =>
      key === 'portfolio.language' ? 'en' : 'dark',
    );
    const set = vi.fn();
    const service = new PreferenceService(
      { get, set },
      { language: 'pt-BR', prefersDark: () => false },
    );
    expect(service.load()).toEqual({ language: 'en', theme: 'dark' });
    expect(get.mock.calls).toEqual([
      ['portfolio.language'],
      ['portfolio.theme'],
    ]);
    service.saveLanguage('pt-BR');
    service.saveTheme('light');
    expect(set.mock.calls).toEqual([
      ['portfolio.language', 'pt-BR'],
      ['portfolio.theme', 'light'],
    ]);
  });
  it.each(['en', 'pt-BR'] as const)(
    'keeps valid saved language %s',
    (language) => {
      expect(
        new PreferenceService(
          {
            get: (key) => (key.endsWith('language') ? language : 'light'),
            set: vi.fn(),
          },
          {
            language: language === 'en' ? 'pt-BR' : 'en-US',
            prefersDark: () => true,
          },
        ).load(),
      ).toEqual({ language, theme: 'light' });
    },
  );
  it.each([true, false])(
    'falls back for missing or corrupt storage, system dark=%s',
    (dark) => {
      for (const value of [null, '', 'invalid', 'EN', 'pt']) {
        const service = new PreferenceService(
          { get: () => value, set: vi.fn() },
          { language: 'en-GB', prefersDark: () => dark },
        );
        expect(service.load()).toEqual({
          language: 'en',
          theme: dark ? 'dark' : 'light',
        });
      }
    },
  );
});
describe('browser adapters', () => {
  it('reads and writes provided storage', () => {
    const storage = { getItem: vi.fn(() => 'value'), setItem: vi.fn() };
    const adapter = new BrowserPreferences(() => storage);
    expect(adapter.get('key')).toBe('value');
    adapter.set('key', 'new');
    expect(storage.getItem).toHaveBeenCalledWith('key');
    expect(storage.setItem).toHaveBeenCalledWith('key', 'new');
  });
  it('handles absent keys and storage access or quota errors', () => {
    expect(
      new BrowserPreferences(() => ({
        getItem: () => null,
        setItem: vi.fn(),
      })).get('missing'),
    ).toBeNull();
    const inaccessible = new BrowserPreferences(() => {
      throw new Error('blocked');
    });
    expect(inaccessible.get('key')).toBeNull();
    expect(() => inaccessible.set('key', 'v')).not.toThrow();
    const quota = new BrowserPreferences(() => ({
      getItem: () => {
        throw new Error();
      },
      setItem: () => {
        throw new Error();
      },
    }));
    expect(quota.get('key')).toBeNull();
    expect(() => quota.set('key', 'v')).not.toThrow();
  });
  it('uses localStorage by default and reads environment', () => {
    localStorage.clear();
    const adapter = new BrowserPreferences();
    adapter.set('key', 'value');
    expect(adapter.get('key')).toBe('value');
    expect(browserEnvironment.language).toBe(navigator.language);
    expect(browserEnvironment.prefersDark()).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith(
      '(prefers-color-scheme: dark)',
    );
    localStorage.clear();
  });
  it('writes clipboard and reports unsupported or denied access', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await new BrowserClipboard(() => ({ writeText })).write('Olá');
    expect(writeText).toHaveBeenCalledWith('Olá');
    await expect(
      new BrowserClipboard(() => undefined).write('x'),
    ).rejects.toThrow('Clipboard unavailable');
    writeText.mockRejectedValue(new Error('denied'));
    await expect(
      new BrowserClipboard(() => ({ writeText })).write('x'),
    ).rejects.toThrow('denied');
  });
});
