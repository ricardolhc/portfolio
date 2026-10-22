import { describe, expect, it, vi } from 'vitest';
import { validateContact } from '../../src/domain/contact';
import {
  composeContact,
  ContactService,
} from '../../src/application/contact-service';

const data = {
  name: 'Ricardo Costa',
  email: 'ricardo@example.com',
  subject: 'Projeto & integração?',
  message: 'Olá! Vamos conversar sobre automação? + 98% #resultado',
};
const labels = { name: 'Nome', email: 'E-mail', message: 'Mensagem' };
describe('contact validation', () => {
  it('accepts real data and trims surrounding whitespace', () => {
    expect(validateContact(data)).toEqual({});
    expect(
      validateContact({ ...data, name: '  Ana  ', email: ' a@b.co ' }),
    ).toEqual({});
  });
  it.each(['name', 'email', 'subject', 'message'] as const)(
    'rejects blank %s',
    (field) => {
      expect(validateContact({ ...data, [field]: ' \n ' })[field]).toBe(
        'required',
      );
    },
  );
  it.each([
    ['name', 2, 100],
    ['subject', 3, 160],
    ['message', 10, 5000],
  ] as const)('enforces exact %s length boundaries', (field, min, max) => {
    expect(
      validateContact({ ...data, [field]: 'a'.repeat(min - 1) })[field],
    ).toBe('short');
    expect(
      validateContact({ ...data, [field]: 'a'.repeat(min) })[field],
    ).toBeUndefined();
    expect(
      validateContact({ ...data, [field]: 'a'.repeat(max) })[field],
    ).toBeUndefined();
    expect(
      validateContact({ ...data, [field]: 'a'.repeat(max + 1) })[field],
    ).toBe('long');
  });
  it.each([
    'missing',
    'a@b',
    '@host.com',
    'a@@host.com',
    'a b@host.com',
    'a@.com',
    'a@b.',
    'a@b.co trailing',
  ])('rejects malformed email %s', (email) => {
    expect(validateContact({ ...data, email }).email).toBe('email');
  });
  it('bounds email length and prevents header injection', () => {
    expect(
      validateContact({ ...data, email: `${'a'.repeat(249)}@b.co` }).email,
    ).toBeUndefined();
    expect(
      validateContact({ ...data, email: `${'a'.repeat(250)}@b.co` }).email,
    ).toBe('long');
    for (const field of ['name', 'subject'] as const)
      for (const newline of ['\r', '\n']) {
        expect(
          validateContact({ ...data, [field]: `Hello${newline}Bcc: x@y.co` })[
            field
          ],
        ).toBe('singleLine');
      }
  });
  it('allows multiple paragraphs in a message while keeping headers on one line', () => {
    expect(
      validateContact({
        ...data,
        message: 'Primeira linha\nSegunda linha\r\nTerceira linha',
      }),
    ).toEqual({});
  });
});
describe('contact application', () => {
  it('composes an exact encoded mailto and readable fallback', () => {
    const result = composeContact(
      {
        ...data,
        name: '  Ricardo Costa  ',
        email: '  ricardo@example.com  ',
        subject: `  ${data.subject}  `,
        message: `  ${data.message}  `,
      },
      labels,
    );
    const body = `Nome: Ricardo Costa\nE-mail: ricardo@example.com\n\nMensagem:\n${data.message}`;
    expect(result.body).toBe(body);
    expect(result.subject).toBe(data.subject);
    expect(result.href).toBe(
      `mailto:contato.ricardolhc@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`,
    );
    expect(decodeURIComponent(result.href.split('&body=')[1]!)).toBe(body);
  });
  it('supports English labels and multiline Unicode messages', () => {
    const result = composeContact(
      { ...data, message: 'Uma solução 🚀\nSegunda linha & = ?' },
      { name: 'Name', email: 'Email', message: 'Message' },
    );
    expect(result.body).toBe(
      'Name: Ricardo Costa\nEmail: ricardo@example.com\n\nMessage:\nUma solução 🚀\nSegunda linha & = ?',
    );
    expect(result.href).toContain('%F0%9F%9A%80%0A');
  });
  it('rejects invalid inputs before composing or opening anything', () => {
    const composer = vi.fn(composeContact);
    const open = vi.fn();
    const service = new ContactService(
      { compose: composer },
      { open },
      { write: vi.fn() },
    );
    expect(() =>
      service.prepare({ ...data, email: 'invalid' }, labels),
    ).toThrow('Invalid contact data');
    expect(composer).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });
  it('coordinates replaceable composer, email and clipboard and propagates errors', async () => {
    const open = vi.fn();
    const write = vi.fn().mockResolvedValue(undefined);
    const compose = vi.fn(() => ({
      subject: 'subject',
      body: 'body',
      href: 'mailto:test',
    }));
    const service = new ContactService({ compose }, { open }, { write });
    expect(service.prepare(data, labels)).toEqual({
      subject: 'subject',
      body: 'body',
      href: 'mailto:test',
    });
    expect(compose).toHaveBeenCalledWith(data, labels);
    service.open('mailto:test');
    expect(open).toHaveBeenCalledWith('mailto:test');
    await service.copy('text');
    expect(write).toHaveBeenCalledWith('text');
    open.mockImplementation(() => {
      throw new Error('unavailable');
    });
    expect(() => service.open('mailto:test')).toThrow('unavailable');
    write.mockRejectedValue(new Error('denied'));
    await expect(service.copy('text')).rejects.toThrow('denied');
  });
});
