// Progressive enhancement for the contact form. Served as a static, same-origin
// file so the site's strict CSP (script-src 'self', no 'unsafe-inline') allows
// it without a hash or nonce. Without this script the form still submits as a
// normal POST and the browser's native validation applies.
//
// SECURITY: everything here is usability only. The endpoint that receives the
// POST MUST independently validate, normalise, length-limit, output-encode,
// rate-limit, and apply its own spam filtering. This script deliberately does
// NOT block any submission on a bot heuristic — see the note on `botcheck`.

const form = document.querySelector('form.inquiry');

if (form) {
  // WHY: novalidate is set here rather than in the markup. With JS off, native
  // validation is the only thing stopping an incomplete cross-origin POST that
  // would strand the visitor on the endpoint's raw JSON response. With JS on,
  // we suppress it so the inline mono errors below own the presentation instead
  // of the browser's bubbles.
  form.noValidate = true;

  const statusEl = form.querySelector('[data-status]');
  const submitBtn = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const tsField = form.querySelector('[data-render-ts]');
  const serviceGroup = form.querySelector('.field-group');
  const submitIdleLabel = submitLabel ? submitLabel.textContent : '';
  const renderedAt = Date.now();

  // Timing signal for the backend. Advisory only: this script never rejects on
  // it, and a backend must treat an empty value (JS off) as "no signal".
  if (tsField) tsField.value = String(renderedAt);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // The status element is never toggled with `hidden`. An aria-live region only
  // announces mutations that happen while it is rendered, so it stays in the
  // DOM permanently and collapses to zero height while empty (see :empty in
  // global.css). Toggling it is how the first message goes silent.
  const setStatus = (message, tone) => {
    if (!statusEl) return;
    statusEl.dataset.tone = tone;
    statusEl.textContent = message;
  };

  const setFieldError = (errorId, message, targets) => {
    const errorEl = document.getElementById(errorId);
    targets.forEach((el) => {
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  };

  const validate = () => {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const service = form.querySelector('input[name="service"]:checked');
    const firstService = form.querySelector('input[name="service"]');
    let firstInvalid = null;

    const check = (ok, errorId, message, targets, focusEl) => {
      setFieldError(errorId, ok ? '' : message, targets);
      if (!ok && !firstInvalid) firstInvalid = focusEl;
    };

    check(name.value.trim().length > 0, 'name-error', 'Enter your name.', [name], name);
    check(
      EMAIL_RE.test(email.value.trim()),
      'email-error',
      'Enter a valid work email.',
      [email],
      email,
    );
    check(
      Boolean(service),
      'service-error',
      'Choose the service you are interested in.',
      serviceGroup ? [serviceGroup] : [],
      firstService,
    );

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  // Clear a field's error as soon as the user starts correcting it.
  form.querySelectorAll('.field-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        setFieldError(`${input.id}-error`, '', [input]);
      }
    });
  });

  form.querySelectorAll('input[name="service"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      setFieldError('service-error', '', serviceGroup ? [serviceGroup] : []);
    });
  });

  const heading = document.getElementById('inquiry-heading');
  const intro = document.querySelector('.contact-intro');

  const onSuccess = () => {
    // One idea per section: the invitation is replaced by the confirmation
    // rather than left standing above it, so the section does not hold an
    // invitation and a completion at the same time.
    form.querySelectorAll('.field, .inquiry-actions').forEach((el) => el.remove());
    if (intro) intro.remove();
    if (heading) heading.textContent = 'Your inquiry is in.';
    setStatus('Jadrin reads every message and will reply to you directly.', 'ok');

    // WHY the heading and not the live region: role="status" takes no accessible
    // name from its content, so focusing it drops a keyboard or screen-reader
    // user onto a nameless element. The submit button is gone by now, so focus
    // would otherwise fall to <body>.
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    } else if (statusEl) {
      statusEl.focus();
    }
  };

  const onFailure = () => {
    if (submitBtn) submitBtn.disabled = false;
    if (submitLabel) submitLabel.textContent = submitIdleLabel;
    setStatus(
      'That did not go through. Please email jgarcia@viispartners.com directly and it will reach us.',
      'error',
    );
  };

  // Everything that decides whether the endpoint actually accepted the lead.
  const deliver = async () => {
    const payload = new FormData(form);
    // WHY: `redirect` is a no-JS-only field. The endpoint answers it with a 303,
    // fetch follows that redirect cross-origin, the followed request carries no
    // CORS grant, and the resulting rejection would report a lead that WAS
    // delivered as a failure. Send it on the navigation path only.
    payload.delete('redirect');

    const response = await fetch(form.action, {
      method: 'POST',
      body: payload,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);

    // WHY: a 2xx is not acceptance. Quota exhaustion and spam classification can
    // both answer 200 with {"success": false}; relaying that as a confirmation
    // would thank someone for a message nobody received — the same silent loss
    // this form was rebuilt to remove, just moved to the server side.
    try {
      const body = await response.json();
      if (body && body.success === false) {
        throw new Error(`Endpoint reported: ${body.message || 'success:false'}`);
      }
    } catch (error) {
      // Swallow only an unparseable body, where the 2xx is the best signal
      // available. Anything else is a real rejection and must surface.
      if (!(error instanceof SyntaxError)) throw error;
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus('Please correct the fields above.', 'error');
      return;
    }

    // NOTE: there is deliberately no client-side bot gate here. The previous
    // version showed a success message and silently discarded the submission
    // when a honeypot or timing heuristic tripped — which meant an autofilled
    // field could make a real lead vanish behind a confirmation. Spam filtering
    // belongs server-side, where a false positive costs an inbox entry rather
    // than a customer.

    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending';
    setStatus('Sending your inquiry.', 'working');

    try {
      await deliver();
      onSuccess();
    } catch {
      onFailure();
    }
  });
}
