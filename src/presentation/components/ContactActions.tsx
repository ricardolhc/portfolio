import { useState } from 'react';
import { useInject } from '../../core/di/inject';
import { TOKENS } from '../../application/tokens';
import { CONTACT_EMAIL } from '../../domain/contact';
import { usePreferences } from '../preferences/PreferencesProvider';
import { Icon } from './Icon';

export function ContactActions() {
  const clipboard = useInject(TOKENS.clipboard);

  const { t } = usePreferences();
  const c = t.contact;

  const [feedback, setFeedback] = useState<'copied' | 'copyError' | null>(null);

  const copy = async () => {
    try {
      await clipboard.write(CONTACT_EMAIL);
      setFeedback('copied');
    } catch {
      setFeedback('copyError');
    }
  };

  return (
    <div className="contact-alternative">
      <p className="contact-email">{CONTACT_EMAIL}</p>
      <button
        type="button"
        className="contact-copy"
        onClick={() => void copy()}
      >
        {c.copyEmail}
        <Icon name="copy" />
      </button>
      <p
        className="contact-copy-status"
        role="status"
        aria-label={c.copyStatusLabel}
        aria-live="polite"
      >
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
