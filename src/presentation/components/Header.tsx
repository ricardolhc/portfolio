import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '../preferences/PreferencesProvider';
import { LanguageSwitcher, ThemeToggle } from './Controls';
import { Icon } from './Icon';

export function Header() {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label={`rc. ${t.home}`}>
          <span className="brand-monogram" aria-hidden="true">
            rc<span>.</span>
          </span>
          <span className="brand-name">Ricardo Costa</span>
        </a>
        <button
          ref={menuButton}
          className="icon-button menu-button"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? t.controls.close : t.controls.menu}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <nav
          id="main-navigation"
          className={`main-navigation ${open ? 'is-open' : ''}`}
          aria-label={t.navigation}
        >
          {(Object.keys(t.nav) as (keyof typeof t.nav)[]).map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {t.nav[id]}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <LanguageSwitcher />
          <span className="control-divider" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
