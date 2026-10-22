import { describe, expect, it, vi } from 'vitest';
import { createToken, Registry } from '../../src/core/di/registry';

describe('Registry', () => {
  it('resolves typed singletons once and isolates registries', () => {
    const token = createToken<{ value: number }>('service');
    const factory = vi.fn(() => ({ value: 42 }));
    const first = new Registry().register(token, factory);
    const second = new Registry().register(token, () => ({ value: 7 }));
    expect(first.resolve(token)).toEqual({ value: 42 });
    expect(first.resolve(token)).toBe(first.resolve(token));
    expect(factory).toHaveBeenCalledTimes(1);
    expect(second.resolve(token)).toEqual({ value: 7 });
  });
  it('creates new factory instances and composes dependencies', () => {
    const base = createToken<number>('base');
    const token = createToken<{ value: number }>('factory');
    const registry = new Registry()
      .register(base, () => 12)
      .register(token, (r) => ({ value: r.resolve(base) }), 'factory');
    expect(registry.resolve(token)).toEqual({ value: 12 });
    expect(registry.resolve(token)).not.toBe(registry.resolve(token));
  });
  it('uses token identity, not descriptive names', () => {
    const a = createToken<number>('same');
    const b = createToken<number>('same');
    const r = new Registry().register(a, () => 1).register(b, () => 2);
    expect(r.resolve(a)).toBe(1);
    expect(r.resolve(b)).toBe(2);
  });
  it('caches even undefined singleton values', () => {
    const token = createToken<undefined>('undefined');
    const factory = vi.fn(() => undefined);
    const r = new Registry().register(token, factory);
    expect(r.resolve(token)).toBeUndefined();
    expect(r.resolve(token)).toBeUndefined();
    expect(factory).toHaveBeenCalledTimes(1);
  });
  it('reports missing and duplicate registrations', () => {
    const token = createToken<number>('missing');
    const r = new Registry();
    expect(() => r.resolve(token)).toThrow(
      'Dependency not registered: missing',
    );
    r.register(token, () => 1);
    expect(() => r.register(token, () => 2)).toThrow(
      'Dependency already registered: missing',
    );
    expect(r.resolve(token)).toBe(1);
  });
  it('detects circular graphs and releases resolution state on failure', () => {
    const a = createToken<number>('a');
    const b = createToken<number>('b');
    const r = new Registry()
      .register(a, (x) => x.resolve(b))
      .register(b, (x) => x.resolve(a));
    expect(() => r.resolve(a)).toThrow('Circular dependency: a');
    expect(() => r.resolve(a)).toThrow('Circular dependency: a');
    let attempts = 0;
    const retry = createToken<number>('retry');
    r.register(retry, () => {
      attempts++;
      if (attempts === 1) throw new Error('temporary');
      return 9;
    });
    expect(() => r.resolve(retry)).toThrow('temporary');
    expect(r.resolve(retry)).toBe(9);
  });
});
