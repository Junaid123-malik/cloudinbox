
import { useState } from 'react';
import {
  CheckCircle2,
  TriangleAlert,
  Send,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../components/Logo';

const MAX = 1000;
const API_URL = import.meta.env.VITE_API_BASE_URL;

const empty = {
  name: '',
  email: '',
  subject: '',
  message: '',
  priority: 'medium',
};

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.subject.trim().length < 3) {
    errors.subject = 'Subject must contain at least 3 characters.';
  } else if (values.subject.trim().length > 120) {
    errors.subject = 'Subject cannot exceed 120 characters.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Please write at least 10 characters.';
  } else if (values.message.length > MAX) {
    errors.message = `Message cannot exceed ${MAX} characters.`;
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');

  const errors = validate(values);

  const showError = (field) => touched[field] && errors[field];

  function updateField(field, value) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function inputProps(field) {
    return {
      id: `f-${field}`,
      name: field,
      value: values[field],
      onChange: (event) => updateField(field, event.target.value),
      onBlur: () =>
        setTouched((previous) => ({
          ...previous,
          [field]: true,
        })),
      'aria-invalid': Boolean(showError(field)),
      'aria-describedby': showError(field) ? `error-${field}` : undefined,
    };
  }

  function renderError(field) {
    if (!showError(field)) return null;

    return (
      <p className="field-error" id={`error-${field}`}>
        {errors[field]}
      </p>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (Object.keys(errors).length > 0) return;

    if (!API_URL) {
      console.error('VITE_API_BASE_URL is missing.');
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch(
        `${API_URL.replace(/\/$/, '')}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            subject: values.subject.trim(),
            message: values.message.trim(),
            priority: values.priority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setStatus('success');
    } catch (error) {
      console.error('CloudInbox submission error:', error);
      setStatus('error');
    }
  }

  function resetForm() {
    setValues(empty);
    setTouched({});
    setStatus('idle');
  }

  return (
    <main className="contact-page">
      <div className="contact-glow contact-glow-one" aria-hidden="true" />
      <div className="contact-glow contact-glow-two" aria-hidden="true" />

      <section className="contact-card" aria-labelledby="contact-heading">
        <header className="contact-top">
          <Logo />

          <span className="contact-status">
            <span className="contact-status-dot" />
            Support portal
          </span>
        </header>

        {status === 'success' ? (
          <div className="success" role="status">
            <span className="success-icon">
              <CheckCircle2 size={32} />
            </span>

            <span className="contact-eyebrow">MESSAGE RECEIVED</span>

            <h1 id="contact-heading">Thanks for reaching out!</h1>

            <p className="contact-description">
              Thanks, {values.name.trim().split(/\s+/)[0]}. Your message
              has been submitted successfully. We will reply to{' '}
              {values.email} soon.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-lg contact-submit"
              onClick={resetForm}
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <div className="contact-heading-block">
              <span className="contact-eyebrow">WE'RE HERE TO HELP</span>

              <h1 id="contact-heading">Let's talk.</h1>

              <p className="contact-description">
                Have a question or need a hand? Send us a message and our
                team will get back to you.
              </p>
            </div>

            <div className="contact-divider">
              <span />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {status === 'error' && (
                <div className="alert contact-alert" role="alert">
                  <TriangleAlert size={18} />
                  <span>
                    Your message could not be sent. Please check your
                    connection and try again.
                  </span>
                </div>
              )}

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    {...inputProps('name')}
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={120}
                  />
                  {renderError('name')}
                </div>

                <div className="field">
                  <label htmlFor="f-email">Email address</label>
                  <input
                    {...inputProps('email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                  />
                  {renderError('email')}
                </div>

                <div className="field span-2">
                  <label htmlFor="f-subject">Subject</label>
                  <input
                    {...inputProps('subject')}
                    type="text"
                    placeholder="What can we help you with?"
                    maxLength={120}
                  />
                  {renderError('subject')}
                </div>

                <div className="field span-2">
                  <label htmlFor="f-priority">Priority level</label>

                  <select
                    id="f-priority"
                    name="priority"
                    value={values.priority}
                    onChange={(event) =>
                      updateField('priority', event.target.value)
                    }
                  >
                    <option value="low">Low — General question</option>
                    <option value="medium">Medium — Reply this week</option>
                    <option value="high">High — Blocking my work</option>
                  </select>

                  <span className="field-hint">
                    Select the urgency that best describes your request.
                  </span>
                </div>

                <div className="field span-2">
                  <div className="contact-label-row">
                    <label htmlFor="f-message">Your message</label>
                    <span className="contact-limit">
                      {values.message.length}/{MAX}
                    </span>
                  </div>

                  <textarea
                    {...inputProps('message')}
                    placeholder="Tell us a little more about how we can help..."
                    rows={5}
                    maxLength={MAX}
                  />

                  {renderError('message') || (
                    <span className="field-hint">
                      Include enough detail so our team can help you.
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg contact-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span className="spinner" />
                    Sending your message...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Send message
                  </>
                )}
              </button>

              <p className="contact-privacy">
                <ShieldCheck size={17} />
                Your message is sent securely to our support inbox.
              </p>
            </form>
          </>
        )}

        <footer className="contact-footer">
          <span>
            Powered by <strong>CloudInbox</strong>
          </span>
          <span>Customer support, simplified.</span>
        </footer>
      </section>
    </main>
  );
}
