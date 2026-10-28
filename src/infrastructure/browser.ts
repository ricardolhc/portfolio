import type {
  ClipboardPort,
  Environment,
  PreferenceStore,
} from '../domain/contracts';

type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export class BrowserPreferences implements PreferenceStore {
  constructor(
    private readonly storage: () => StoragePort = () => window.localStorage,
  ) {}

  get(key: string): string | null {
    try {
      return this.storage().getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      this.storage().setItem(key, value);
    } catch {
      // Storage may be blocked or full; preferences remain usable in memory.
    }
  }
}

export const browserEnvironment: Environment = {
  get language() {
    return navigator.language;
  },
  prefersDark: () => window.matchMedia('(prefers-color-scheme: dark)').matches,
};

export class BrowserClipboard implements ClipboardPort {
  constructor(
    private readonly clipboard: () =>
      Pick<Clipboard, 'writeText'> | undefined = () => navigator.clipboard,
  ) {}

  async write(text: string): Promise<void> {
    const clipboard = this.clipboard();

    if (!clipboard) throw new Error('Clipboard unavailable');

    await clipboard.writeText(text);
  }
}
