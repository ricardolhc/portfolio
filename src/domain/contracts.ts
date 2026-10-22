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
export interface MailClient {
  open(url: string): void;
}
export interface ClipboardPort {
  write(text: string): Promise<void>;
}
export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export interface MailLabels {
  name: string;
  email: string;
  message: string;
}
export interface PreparedMessage {
  subject: string;
  body: string;
  href: string;
}
export interface MessageComposer {
  compose(data: ContactData, labels: MailLabels): PreparedMessage;
}
export interface ContactApplication {
  prepare(data: ContactData, labels: MailLabels): PreparedMessage;
  open(url: string): void;
  copy(text: string): Promise<void>;
}
export interface PreferencesApplication {
  load(): { language: Language; theme: Theme };
  saveLanguage(language: Language): void;
  saveTheme(theme: Theme): void;
}
