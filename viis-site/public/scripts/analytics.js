// GA4 loader and conversion tracking. A static, same-origin module, so the
// strict CSP (script-src 'self' plus Google's tag host) allows it with no
// inline snippet, no hash, and no nonce. The measurement ID arrives on this
// script tag's data attribute at build time (PUBLIC_GA_MEASUREMENT_ID); the
// tag is not rendered at all when the variable is unset.
//
// PRIVACY: the only event sent beyond page views is generate_lead, fired
// when an audit request is accepted. It carries no form data.

const me = document.currentScript;
const id = me && me.dataset.measurementId;

if (id && /^G-[A-Z0-9]+$/.test(id)) {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  // WHY: IP anonymisation is the default in GA4; this keeps Google Signals
  // and ad personalisation off, so the property reports and nothing more.
  gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });

  // WHY after load, not in the head: the tag is ~100KB of script the first
  // paint does not need; the pageview still reaches GA once it arrives.
  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  };
  if (document.readyState === 'complete') load();
  else window.addEventListener('load', load, { once: true });

  // Conversion: the audit form dispatches this on an accepted request (the
  // fetch path). The no-JS path lands on /thanks/, which counts once there.
  const lead = (method) => gtag('event', 'generate_lead', { method });
  document.addEventListener('audit:submitted', () => lead('form'));
  if (location.pathname.replace(/\/?$/, '/') === '/thanks/') lead('form_redirect');
}
