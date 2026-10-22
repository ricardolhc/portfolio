export type Language = 'pt-BR' | 'en';
export type Theme = 'light' | 'dark';
export interface PreferenceStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}
export interface Environment {
  readonly language: string;
  prefersDark(): boolean;
}
export interface ClipboardPort {
  write(text: string): Promise<void>;
}
export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export interface ContactGateway {
  send(message: ContactMessage): Promise<void>;
}
export interface PreferencesApplication {
  load(): { language: Language; theme: Theme };
  saveLanguage(language: Language): void;
  saveTheme(theme: Theme): void;
}
