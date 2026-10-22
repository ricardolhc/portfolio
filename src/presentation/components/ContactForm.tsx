import { useRef, useState, type FormEvent } from 'react';
import { useInject } from '../../core/di/inject';
import { TOKENS } from '../../application/tokens';
import type { ContactData, PreparedMessage } from '../../domain/contracts';
import {
  CONTACT_EMAIL,
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
} from '../../domain/contact';
import { usePreferences } from '../preferences/PreferencesProvider';
import { Icon } from './Icon';

type Feedback =
  | 'prepared'
  | 'prepareError'
  | 'openError'
  | 'invalid'
  | 'copied'
  | 'copyError';
const empty: ContactData = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const service = useInject(TOKENS.contact);
  const { t } = usePreferences();
  const c = t.contact;
  const [data, setData] = useState<ContactData>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [prepared, setPrepared] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const prepare = () => {
    const next = validateContact(data);
    setErrors(next);
    const first = CONTACT_FIELDS.find((field) => next[field]);
    if (first) {
      setFeedback('invalid');
      form.current
        ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
        ?.focus();
      return null;
    }
    try {
      const message = service.prepare(data, c.mailLabels);
      setPrepared(true);
      return message;
    } catch {
      setPrepared(false);
      setFeedback('prepareError');
      return null;
    }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = prepare();
    if (!message) return;
    try {
      service.open(message.href);
      setFeedback('prepared');
    } catch {
      setFeedback('openError');
    }
  };
  const copy = async (address: boolean) => {
    try {
      let text = CONTACT_EMAIL;
      if (address && !preview) setPrepared(false);
      if (!address) {
        const message = prepare();
        if (!message) return;
        text = `${message.subject}\n\n${message.body}`;
      }
      await service.copy(text);
      setFeedback('copied');
    } catch {
      setFeedback('copyError');
    }
  };
  let preview: PreparedMessage | null = null;
  if (prepared) {
    try {
      preview = service.prepare(data, c.mailLabels);
    } catch {
      // Keep entered data and the email-address fallback available if composition fails.
    }
  }
  const status = prepared && !preview ? 'prepareError' : feedback;

  return (
    <div className="contact-form-wrap">
      <form ref={form} onSubmit={submit} noValidate aria-label={c.formLabel}>
        <p id="form-hint" className="form-hint">
          {c.hint}
        </p>
        <div className="form-grid">
          {CONTACT_FIELDS.map((field) => (
            <div
              className={`field ${field === 'subject' || field === 'message' ? 'field-wide' : ''}`}
              key={field}
            >
              <label htmlFor={`contact-${field}`}>{c.fields[field]}</label>
              {field === 'message' ? (
                <textarea
                  id={`contact-${field}`}
                  name={field}
                  rows={5}
                  required
                  maxLength={CONTACT_LIMITS[field][1]}
                  value={data[field]}
                  placeholder={c.placeholders[field]}
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={
                    errors[field] ? `error-${field}` : 'form-hint'
                  }
                  onChange={(event) => {
                    setData({ ...data, [field]: event.target.value });
                    setPrepared(false);
                    setFeedback(null);
                  }}
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
                  maxLength={CONTACT_LIMITS[field][1]}
                  value={data[field]}
                  placeholder={c.placeholders[field]}
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={
                    errors[field] ? `error-${field}` : 'form-hint'
                  }
                  onChange={(event) => {
                    setData({ ...data, [field]: event.target.value });
                    setPrepared(false);
                    setFeedback(null);
                  }}
                />
              )}
              {errors[field] && (
                <p className="field-error" id={`error-${field}`}>
                  {c.errors[errors[field]]}
                </p>
              )}
            </div>
          ))}
        </div>
        <button className="button button-primary submit-button" type="submit">
          {c.submit}
          <Icon name="arrow" />
        </button>
        <p className="form-notice">{c.notice}</p>
        <p className="form-status" role="status" aria-live="polite">
          {status ? c[status] : ''}
        </p>
      </form>
      <div className="copy-options">
        <p>{c.fallback}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="text-button"
            onClick={() => void copy(true)}
          >
            {c.copyEmail}
            <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => void copy(false)}
          >
            {c.copyMessage}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <label className="sr-only" htmlFor="copy-address">
          {c.emailLabel}
        </label>
        <input
          id="copy-address"
          className="copy-preview"
          readOnly
          value={CONTACT_EMAIL}
        />
        <label className="sr-only" htmlFor="copy-preview">
          {c.preview}
        </label>
        <textarea
          id="copy-preview"
          className="copy-preview"
          rows={3}
          readOnly
          value={preview ? `${preview.subject}\n\n${preview.body}` : ''}
          placeholder={c.emptyPreview}
        />
      </div>
    </div>
  );
}
