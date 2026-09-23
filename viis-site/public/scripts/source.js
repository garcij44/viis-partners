// First-touch campaign source. Loaded on every page (Layout.astro) so a
// visitor who lands on /websites from a tagged link and requests the audit
// from the homepage is still credited to that link. audit.js imports
// storedSource() and adds the tags to the POST at submit.
//
// Storage is per tab and ends with it. Every storage call is guarded: a
// private window, blocked site data, or a sandbox can make the accessor
// itself throw, and attribution must never break the page or the form.
//
// SECURITY: nothing here is trusted. api/src/lib/validate.ts lowercases each
// tag, drops any outside [a-z0-9_-]{1,60}, and never rejects a lead over one.

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];
const PREFIX = 'viis:';

const read = (key) => {
  try {
    return window.sessionStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.sessionStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage unavailable or full: the lead is recorded as direct.
  }
};

// WHY all-or-nothing: the three tags describe one link. Topping up a missing
// tag from a later link would credit one campaign with another's medium.
const capture = () => {
  if (KEYS.some((key) => read(key) !== null)) return;
  const params = new URLSearchParams(window.location.search);
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) write(key, value);
  }
};

/** The stored tags, keyed by their POST field names; absent tags are omitted. */
export const storedSource = () => {
  const tags = {};
  for (const key of KEYS) {
    const value = read(key);
    if (value) tags[key] = value;
  }
  return tags;
};

capture();
