import { useContext } from 'react';
import { DependencyContext } from './dependency-provider';
import type { Registry, Token } from './registry';

export function inject<T>(registry: Registry, token: Token<T>): T {
  return registry.resolve(token);
}

export function useInject<T>(token: Token<T>): T {
  const registry = useContext(DependencyContext);
  if (!registry) throw new Error('useInject requires DependencyProvider');
  return inject(registry, token);
}
