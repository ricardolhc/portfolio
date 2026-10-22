export interface Token<T> {
  readonly key: symbol;
  readonly name: string;
  readonly _type?: T;
}

export function createToken<T>(name: string): Token<T> {
  return { key: Symbol(name), name };
}

type Lifetime = 'singleton' | 'factory';
interface Entry {
  factory: (registry: Registry) => unknown;
  lifetime: Lifetime;
  initialized: boolean;
  instance?: unknown;
}

export class Registry {
  private readonly entries = new Map<symbol, Entry>();
  private readonly resolving = new Set<symbol>();

  register<T>(
    token: Token<T>,
    factory: (registry: Registry) => T,
    lifetime: Lifetime = 'singleton',
  ): this {
    if (this.entries.has(token.key))
      throw new Error(`Dependency already registered: ${token.name}`);
    this.entries.set(token.key, { factory, lifetime, initialized: false });
    return this;
  }

  resolve<T>(token: Token<T>): T {
    const entry = this.entries.get(token.key);
    if (!entry) throw new Error(`Dependency not registered: ${token.name}`);
    if (entry.initialized) return entry.instance as T;
    if (this.resolving.has(token.key))
      throw new Error(`Circular dependency: ${token.name}`);
    this.resolving.add(token.key);
    try {
      const instance = entry.factory(this);
      if (entry.lifetime === 'singleton') {
        entry.instance = instance;
        entry.initialized = true;
      }
      return instance as T;
    } finally {
      this.resolving.delete(token.key);
    }
  }
}
