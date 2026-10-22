import { createContext, type ReactNode } from 'react';
import type { Registry } from './registry';

export const DependencyContext = createContext<Registry | null>(null);

export function DependencyProvider({
  registry,
  children,
}: {
  registry: Registry;
  children: ReactNode;
}) {
  return (
    <DependencyContext.Provider value={registry}>
      {children}
    </DependencyContext.Provider>
  );
}
