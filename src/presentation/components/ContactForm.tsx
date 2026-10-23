import { useRef, useState, type FormEvent } from 'react';
import { useInject } from '../../core/di/inject';
import { TOKENS } from '../../application/tokens';
import type { ContactMessage } from '../../domain/contracts';
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  ContactGatewayError,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '../../domain/contact';
import { usePreferences } from '../preferences/PreferencesProvider';
import { ContactActions } from './ContactActions';
import { Icon } from './Icon';

const empty: ContactMessage = { name: '', email: '', subject: '', message: '' };
type Status =
  'idle' | 'invalid' | 'sending' | 'success' | 'error' | 'rateLimited';

export function ContactForm() {
  const gateway = useInject(TOKENS.contactGateway);

  const { t } = usePreferences();
  const c = t.contact;

  const [data, setData] = useState<ContactMessage>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const inFlight = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const sending = status === 'sending';

  const update = (field: ContactField, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('idle');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inFlight.current) return;

    const next = validateContact(data);
    setErrors(next);

    const first = CONTACT_FIELDS.find((field) => next[field]);

    if (first) {
      setStatus('invalid');
      form.current
        ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
        ?.focus();
      return;
    }

    if (new FormData(event.currentTarget).get('_gotcha')) {
      setStatus('error');
      return;
    }

    inFlight.current = true;
    setStatus('sending');

    try {
      await gateway.send(normalizeContact(data));
      setData(empty);
      setStatus('success');
    } catch (error) {
      setStatus(
        error instanceof ContactGatewayError && error.code === 'rateLimited'
          ? 'rateLimited'
          : 'error',
      );
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <div className="contact-form-wrap">
      <form
        ref={form}
        onSubmit={(event) => void submit(event)}
        noValidate
        aria-label={c.formLabel}
        aria-busy={sending}
      >
        <p className="contact-hint" id="contact-hint">
          {c.hint}
        </p>
        <fieldset className="contact-fields" disabled={sending}>
          <legend className="sr-only">{c.formLabel}</legend>
          {CONTACT_FIELDS.map((field) => (
            <div
              className={`contact-field ${field === 'name' || field === 'email' ? '' : 'contact-field-wide'}`}
              key={field}
            >
              <label htmlFor={`contact-${field}`}>{c.fields[field]}</label>
              {field === 'message' ? (
                <textarea
                  id={`contact-${field}`}
                  name={field}
                  rows={5}
                  required
                  maxLength={CONTACT_LIMITS[field]}
                  value={data[field]}
                  onChange={(event) => update(field, event.target.value)}
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={
                    errors[field] ? `contact-error-${field}` : 'contact-hint'
                  }
                />
              ) : (
                <input
                  id={`contact-${field}`}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  autoComplete={
                    field === 'name'
                      ? 'name'
                      : field === 'email'
                        ? 'email'
                        : 'off'
                  }
                  required
                  maxLength={CONTACT_LIMITS[field]}
                  value={data[field]}
                  onChange={(event) => update(field, event.target.value)}
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={
                    errors[field] ? `contact-error-${field}` : 'contact-hint'
                  }
                />
              )}
              {errors[field] && (
                <p
                  className="contact-field-error"
                  id={`contact-error-${field}`}
                >
                  {c.errors[errors[field]]}
                </p>
              )}
            </div>
          ))}
          <div hidden aria-hidden="true">
            <label htmlFor="contact-website">{c.honeypot}</label>
            <input
              id="contact-website"
              name="_gotcha"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        </fieldset>
        <button
          className="button button-primary contact-submit"
          type="submit"
          disabled={sending}
        >
          {sending ? c.sending : c.submit}
          {sending ? (
            <span className="contact-loader" aria-hidden="true" />
          ) : (
            <Icon name="arrow" />
          )}
        </button>
        <p
          className="contact-status"
          role="status"
          aria-label={c.statusLabel}
          aria-live="polite"
        >
          {status === 'idle' ? '' : c.status[status]}
        </p>
      </form>
      <ContactActions />
    </div>
  );
}
