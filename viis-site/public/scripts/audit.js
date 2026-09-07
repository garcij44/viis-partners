// Progressive enhancement for the audit form. A static, same-origin module so
// the strict CSP (script-src 'self') allows it with no hash or nonce. Without
// it the form still submits as a plain POST and the function redirects.
//
// SECURITY: everything here is usability. api/src/lib/validate.ts is the
// boundary. This script never blocks a submission on a bot heuristic: an
// earlier form on this site discarded real leads behind a fake confirmation.

const form = document.querySelector('[data-audit-form]');

if (form) {
  // WHY at runtime, not in the markup: with JS off, native validation is what
  // stops an incomplete POST; with JS on, the inline errors own the job.
  form.noValidate = true;

  const status = form.querySelector('[data-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const idleLabel = submitLabel ? submitLabel.textContent : '';
  const inputs = [...form.querySelectorAll('.input')];
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const CONTACT = 'jgarcia@viispartners.com';

  const setStatus = (message, tone) => {
    if (!status) return;
    status.dataset.tone = tone || '';
    status.textContent = message;
  };

  const setStatusWithFallback = (lead) => {
    if (!status) return;
    status.dataset.tone = 'error';
    status.textContent = `${lead} `;
    const link = document.createElement('a');
    link.href = `mailto:${CONTACT}`;
    link.textContent = `Email ${CONTACT} instead.`;
    status.append(link);
  };

  const setFieldError = (input, message) => {
    const error = document.getElementById(`${input.id}-error`);
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (!error) return;
    error.textContent = message || '';
    error.hidden = !message;
  };

  // Mirrors the server's messages; the server remains the authority.
  const messageFor = (input) => {
    const value = input.value.trim();
    if (input.required && !value) {
      if (input.name === 'name') return 'Enter your name.';
      if (input.name === 'business') return 'Enter your business name.';
      if (input.name === 'email') return 'Enter a valid email address.';
      if (input.name === 'website') return 'Enter your website address.';
    }
    if (input.name === 'email' && value && !EMAIL.test(value)) return 'Enter a valid email address.';
    return '';
  };

  const validate = () => {
    let firstInvalid = null;
    for (const input of inputs) {
      const message = messageFor(input);
      setFieldError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  const applyServerErrors = (errors) => {
    let first = null;
    for (const input of inputs) {
      const message = errors[input.name] || '';
      setFieldError(input, message);
      if (message && !first) first = input;
    }
    if (first) first.focus();
  };

  for (const input of inputs) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setFieldError(input, '');
    });
  }

  const setBusy = (busy) => {
    if (submit) submit.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? 'Sending' : idleLabel;
  };

  // The card keeps its shape; the invitation is replaced by the confirmation.
  const showSuccess = () => {
    for (const el of form.querySelectorAll('.field, .actions, .note')) el.remove();
    const heading = document.createElement('p');
    heading.className = 't-heading';
    heading.textContent = 'Your request is in.';
    heading.setAttribute('tabindex', '-1');
    const body = document.createElement('p');
    body.className = 'fg-2';
    body.textContent =
      'A confirmation is on its way to your inbox. The report follows within three business days.';
    form.append(heading, body);
    heading.focus();
  };

  // A 2xx is not acceptance on its own: the body must say ok. Anything else
  // surfaces so nobody is thanked for a request that was not received.
  const deliver = async () => {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (response.status === 400 && body && body.errors) return { kind: 'invalid', errors: body.errors };
    if (response.status === 429) return { kind: 'limited', message: body && body.message };
    if (!response.ok || !body || body.ok !== true) throw new Error(`Endpoint returned ${response.status}`);
    return { kind: 'ok' };
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) {
      setStatus('Check the fields marked above.', 'error');
      return;
    }
    setBusy(true);
    setStatus('Sending your request.', 'working');
    try {
      const result = await deliver();
      if (result.kind === 'ok') {
        showSuccess();
        // Analytics listens for this (public/scripts/analytics.js). No detail:
        // nothing typed into the form travels with the event.
        document.dispatchEvent(new CustomEvent('audit:submitted'));
        return;
      }
      setBusy(false);
      if (result.kind === 'invalid') {
        applyServerErrors(result.errors);
        setStatus('Check the fields marked above.', 'error');
      } else {
        setStatus(result.message || 'Too many requests. Try again in an hour.', 'error');
      }
    } catch {
      setBusy(false);
      setStatusWithFallback("Didn't send.");
    }
  });
}
