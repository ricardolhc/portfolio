import { describe, it, expect, vi } from 'vitest';
import { createRegistry } from '../../src/composition-root';
import { TOKENS } from '../../src/application/tokens';
import {
  BrowserClipboard,
  BrowserMailClient,
} from '../../src/infrastructure/browser';

describe('composition root and browser defaults', () => {
  it('builds independent graphs with working preferences and message composition', () => {
    localStorage.clear();
    const a = createRegistry();
    const b = createRegistry();
    expect(a.resolve(TOKENS.preferences)).not.toBe(
      b.resolve(TOKENS.preferences),
    );
    a.resolve(TOKENS.preferences).saveLanguage('en');
    expect(b.resolve(TOKENS.preferences).load().language).toBe('en');
    const result = a
      .resolve(TOKENS.contact)
      .prepare(
        {
          name: 'Ana',
          email: 'a@b.co',
          subject: 'Hello',
          message: 'A new project.',
        },
        { name: 'Name', email: 'Email', message: 'Message' },
      );
    expect(result.href).toContain(
      'mailto:contato.ricardolhc@gmail.com?subject=Hello&body=Name%3A%20Ana',
    );
    localStorage.clear();
  });
  it('uses the clipboard exposed by the browser', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    await new BrowserClipboard().write('example');
    expect(writeText).toHaveBeenCalledWith('example');
    if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });
  it('assigns mailto to the location boundary without launching a real client', () => {
    const location = { href: '' };
    const original = window;
    vi.stubGlobal('window', { location });
    try {
      new BrowserMailClient().open('mailto:test@example.com');
      expect(location.href).toBe('mailto:test@example.com');
    } finally {
      vi.stubGlobal('window', original);
    }
  });
});
