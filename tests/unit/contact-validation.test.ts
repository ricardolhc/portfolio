import { describe, expect, it } from 'vitest';
import { normalizeContact, validateContact } from '../../src/domain/contact';

const valid = {
  name: ' Ana ',
  email: ' ana@example.com ',
  subject: ' Projeto ',
  message: ' Uma solução para a empresa. ',
};
describe('contact validation and normalization', () => {
  it('normalizes every field without changing the original input', () => {
    expect(normalizeContact(valid)).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      subject: 'Projeto',
      message: 'Uma solução para a empresa.',
    });
    expect(valid.name).toBe(' Ana ');
    expect(validateContact(valid)).toEqual({});
  });
  it.each(['name', 'email', 'subject', 'message'] as const)(
    'rejects whitespace-only %s',
    (field) => {
      expect(validateContact({ ...valid, [field]: ' \n\t ' })[field]).toBe(
        'required',
      );
      expect(validateContact({ ...valid, [field]: '' })[field]).toBe(
        'required',
      );
    },
  );
  it.each([
    ['name', 100],
    ['subject', 160],
    ['message', 5000],
  ] as const)(
    'accepts exact %s boundaries and rejects longer input',
    (field, max) => {
      expect(
        validateContact({ ...valid, [field]: 'a' })[field],
      ).toBeUndefined();
      expect(
        validateContact({ ...valid, [field]: 'a'.repeat(max) })[field],
      ).toBeUndefined();
      expect(
        validateContact({ ...valid, [field]: 'a'.repeat(max + 1) })[field],
      ).toBe('tooLong');
    },
  );
  it.each([
    'invalid',
    'a@b',
    '@b.co',
    'a@@b.co',
    'a b@c.co',
    'a@b.',
    'a@.co',
    'a@b.co trailing',
  ])('rejects invalid email %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toBe('invalidEmail');
  });
  it('bounds email and prevents multiline names or subjects while allowing multiline messages', () => {
    expect(
      validateContact({ ...valid, email: `${'a'.repeat(249)}@b.co` }).email,
    ).toBeUndefined();
    expect(
      validateContact({ ...valid, email: `${'a'.repeat(250)}@b.co` }).email,
    ).toBe('tooLong');
    for (const field of ['name', 'subject'] as const)
      for (const newline of ['\r', '\n'])
        expect(
          validateContact({ ...valid, [field]: `Hello${newline}other` })[field],
        ).toBe('singleLine');
    expect(
      validateContact({
        ...valid,
        message: 'Linha um\nLinha dois\r\n🚀 & dados',
      }),
    ).toEqual({});
  });
});
