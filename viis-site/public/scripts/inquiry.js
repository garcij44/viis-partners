// Progressive enhancement for the contact form. Served as a static, same-origin
// file so the site's strict CSP (script-src 'self', no 'unsafe-inline') allows
// it without a hash or nonce. Without this script the form still submits as a
// normal POST and the browser's native validation applies.
//
// SECURITY: everything here is usability + first-pass bot friction only. The
// endpoint that receives the POST MUST independently validate, normalise,
// length-limit, output-encode, rate-limit, and re-check the honeypot/timestamp.

const form = document.querySelector('form.inquiry');

if (form) {
  const statusEl = form.querySelector('[data-status]');
  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const tsField = form.querySelector('[data-render-ts]');
  const honeypot = form.querySelector('#company_url');
  const renderedAt = Date.now();
  if (tsField) tsField.value = String(renderedAt);

  const MIN_FILL_MS = 3000; // faster than this = almost certainly a bot
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setStatus = (message, tone) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.tone = tone;
    statusEl.hidden = false;
  };

  const showFieldError = (input, message) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  };

  const clearFieldError = (input) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  };

  const validate = () => {
    let firstInvalid = null;
    const check = (input, message, ok) => {
      if (ok) {
        clearFieldError(input);
      } else {
        showFieldError(input, message);
        if (!firstInvalid) firstInvalid = input;
      }
    };
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const project = form.querySelector('#project');
    check(name, 'Enter your name.', name.value.trim().length > 0);
    check(email, 'Enter a valid work email.', EMAIL_RE.test(email.value.trim()));
    check(project, 'Tell us a little about the project.', project.value.trim().length > 0);
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  // Clear a field's error as soon as the user starts correcting it.
  form.querySelectorAll('.field-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') clearFieldError(input);
    });
  });

  const absorbAsBot = () => {
    // Show the same confirmation a human sees, but never actually submit.
    setStatus('Thank you. Your inquiry has been received.', 'ok');
    form.querySelectorAll('input, textarea, button').forEach((el) => {
      el.disabled = true;
    });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1. Honeypot filled = bot. Absorb silently before doing anything else.
    if (honeypot && honeypot.value) {
      absorbAsBot();
      return;
    }

    // 2. Validate for humans, so an incomplete form always gets real feedback.
    if (!validate()) {
      setStatus('Please correct the fields above.', 'error');
      return;
    }

    // 3. Valid data submitted faster than any human could type it = bot.
    if (Date.now() - renderedAt < MIN_FILL_MS) {
      absorbAsBot();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending';
    setStatus('Sending your inquiry.', 'working');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);
      // Success: replace the form body with a confirmation.
      form.querySelectorAll('.field, .inquiry-actions').forEach((el) => el.remove());
      setStatus('Thank you. Your inquiry is in. Jadrin will read it and reply to you directly.', 'ok');
    } catch {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = 'Request a consultation';
      setStatus(
        'That did not go through. Please email jgarcia@viispartners.com directly and it will reach us.',
        'error',
      );
    }
  });
}
