import { describe, expect, it, vi } from 'vitest';
import { FormspreeContactGateway } from '../../src/infrastructure/formspree-contact-gateway';

const message = {
  name: ' Ana ',
  email: ' ana@example.com ',
  subject: ' Integração & projeto? ',
  message: ' Olá Ricardo!\nUm processo com 98% + 🚀. ',
};
describe('Formspree gateway', () => {
  it('accepts the official SDK acknowledgement with next and does not follow it', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response('{"next":"https://formspree.io/thanks"}', { status: 200 }),
      );
    await expect(
      new FormspreeContactGateway(request).send(message),
    ).resolves.toBeUndefined();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('POSTs normalized JSON to the real configured endpoint with explicit JSON acceptance and honeypot', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, next: '/thanks' }), {
        status: 200,
      }),
    );
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    await new FormspreeContactGateway(request).send(message);
    expect(request).toHaveBeenCalledTimes(1);
    const [url, init] = request.mock.calls[0]!;
    expect(url).toBe('https://formspree.io/f/moeeapay');
    expect(init).toMatchObject({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      redirect: 'error',
      credentials: 'omit',
    });
    expect(JSON.parse(init!.body as string)).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      subject: 'Integração & projeto?',
      message: 'Olá Ricardo!\nUm processo com 98% + 🚀.',
      _gotcha: '',
    });
    expect(timeout).toHaveBeenCalledWith(15000);
    expect(init!.signal).toBe(timeout.mock.results[0]!.value);
  });
  it.each([200, 201, 202])(
    'accepts an acknowledged HTTP %s response',
    async (status) => {
      const request = vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response('{"ok":true}', { status }));
      await expect(
        new FormspreeContactGateway(request).send(message),
      ).resolves.toBeUndefined();
    },
  );
  it.each([400, 403, 422, 500, 503])(
    'rejects HTTP %s even with a success-looking body',
    async (status) => {
      const request = vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response('{"ok":true}', { status }));
      await expect(
        new FormspreeContactGateway(request).send(message),
      ).rejects.toMatchObject({ code: 'unavailable' });
    },
  );
  it('classifies rate limiting even when its response is not JSON', async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('Slow down', { status: 429 }));
    await expect(
      new FormspreeContactGateway(request).send(message),
    ).rejects.toMatchObject({ code: 'rateLimited' });
  });
  it.each([
    '',
    '<html>error</html>',
    '{}',
    'null',
    '[]',
    'true',
    '42',
    '"text"',
    '{"ok":false}',
    '{"next":42}',
    '{"next":null}',
    '{"ok":false,"next":"/thanks"}',
    '{"ok":"true"}',
    '{"ok":true,"errors":[]}',
    '{"ok":true,"errors":[{"message":"technical"}]}',
    '{"ok":true,"error":"technical"}',
  ])(
    'does not acknowledge an invalid successful response: %s',
    async (body) => {
      const request = vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(body, { status: 200 }));
      await expect(
        new FormspreeContactGateway(request).send(message),
      ).rejects.toMatchObject({ code: 'unavailable' });
    },
  );
  it.each([
    new TypeError('offline'),
    new DOMException('timed out', 'TimeoutError'),
  ])(
    'wraps transport failures without exposing server details',
    async (error) => {
      const request = vi.fn<typeof fetch>().mockRejectedValue(error);
      await expect(
        new FormspreeContactGateway(request).send(message),
      ).rejects.toMatchObject({ code: 'unavailable' });
    },
  );
  it('does not transmit invalid messages', async () => {
    const request = vi.fn<typeof fetch>();
    await expect(
      new FormspreeContactGateway(request).send({
        ...message,
        email: 'invalid',
      }),
    ).rejects.toMatchObject({ code: 'unavailable' });
    expect(request).not.toHaveBeenCalled();
  });
});
