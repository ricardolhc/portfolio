import type { ContactGateway, ContactMessage } from '../domain/contracts';
import {
  ContactGatewayError,
  normalizeContact,
  validateContact,
} from '../domain/contact';
import { FORMSPREE_ENDPOINT } from '../config/contact';

export class FormspreeContactGateway implements ContactGateway {
  constructor(
    private readonly request: typeof fetch = (...args) => fetch(...args),
  ) {}

  async send(message: ContactMessage): Promise<void> {
    const normalized = normalizeContact(message);
    if (Object.keys(validateContact(normalized)).length > 0)
      throw new ContactGatewayError('unavailable');
    let response: Response;
    try {
      response = await this.request(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...normalized, _gotcha: '' }),
        credentials: 'omit',
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ContactGatewayError('unavailable');
    }
    if (response.status === 429) throw new ContactGatewayError('rateLimited');
    if (!response.ok) throw new ContactGatewayError('unavailable');
    let result: unknown;
    try {
      result = await response.json();
    } catch {
      throw new ContactGatewayError('unavailable');
    }
    if (
      typeof result !== 'object' ||
      result === null ||
      'errors' in result ||
      'error' in result
    )
      throw new ContactGatewayError('unavailable');
    const acknowledged =
      'ok' in result
        ? result.ok === true
        : 'next' in result && typeof result.next === 'string';
    if (!acknowledged) throw new ContactGatewayError('unavailable');
  }
}
