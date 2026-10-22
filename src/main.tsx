import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRegistry } from './composition-root';
import { DependencyProvider } from './core/di/dependency-provider';
import { PreferencesProvider } from './presentation/preferences/PreferencesProvider';
import { App } from './presentation/App';
import './styles.css';

const registry = createRegistry();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependencyProvider registry={registry}>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </DependencyProvider>
  </StrictMode>,
);
