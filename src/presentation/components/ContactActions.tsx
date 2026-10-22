import { useState } from 'react';
import { useInject } from '../../core/di/inject';
import { TOKENS } from '../../application/tokens';
import { createEmailLink } from '../../application/contact-service';
import { CONTACT_EMAIL } from '../../domain/contact';
import { usePreferences } from '../preferences/PreferencesProvider';
import { Icon } from './Icon';

export function ContactActions() {
  const clipboard = useInject(TOKENS.clipboard);
  const { t } = usePreferences();
  const c = t.contact;
  const [feedback, setFeedback] = useState<'copied' | 'copyError' | null>(null);
  const href = createEmailLink(c.subject);
  const copy = async () => {
    try {
      await clipboard.write(CONTACT_EMAIL);
      setFeedback('copied');
    } catch {
      setFeedback('copyError');
    }
  };

  return (
    <div className="contact-actions">
      <a
        className="contact-email"
        href={href}
        aria-label={`${c.emailLabel}: ${CONTACT_EMAIL}`}
      >
        {CONTACT_EMAIL}
      </a>
      <div className="contact-buttons">
        <a
          className="button button-primary"
          href={href}
          aria-describedby="contact-notice"
        >
          {c.send}
          <Icon name="arrow" />
        </a>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => void copy()}
        >
          {c.copyEmail}
          <Icon name="copy" />
        </button>
      </div>
      <p id="contact-notice" className="contact-notice">
        {c.notice}
      </p>
      <p className="contact-status" role="status" aria-live="polite">
        {feedback ? c[feedback] : ''}
      </p>
      {feedback === 'copyError' && (
        <div className="contact-fallback">
          <label className="sr-only" htmlFor="copy-address">
            {c.manualCopy}
          </label>
          <input
            id="copy-address"
            className="copy-address"
            readOnly
            value={CONTACT_EMAIL}
          />
        </div>
      )}
    </div>
  );
}
