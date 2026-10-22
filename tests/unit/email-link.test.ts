import { describe, expect, it } from 'vitest';
import { createEmailLink } from '../../src/application/contact-service';

describe('native email link', () => {
  it.each([
    [
      'Contato pelo portfólio',
      'mailto:contato.ricardolhc@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio',
    ],
    [
      'Portfolio contact',
      'mailto:contato.ricardolhc@gmail.com?subject=Portfolio%20contact',
    ],
    [
      'Projeto & integração? + 98% #🚀',
      'mailto:contato.ricardolhc@gmail.com?subject=Projeto%20%26%20integra%C3%A7%C3%A3o%3F%20%2B%2098%25%20%23%F0%9F%9A%80',
    ],
  ])(
    'encodes the subject %s without requiring visitor data',
    (subject, expected) => {
      expect(createEmailLink(subject)).toBe(expected);
    },
  );
});
