import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normaliseWebsite, sourceFrom } from '../src/lib/validate';

describe('normaliseWebsite', () => {
  it('adds https to a bare domain', () => assert.equal(normaliseWebsite('example.com'), 'https://example.com/'));
  it('keeps http when given', () => assert.equal(normaliseWebsite('http://example.com/a?b=1'), 'http://example.com/a?b=1'));
  it('trims surrounding whitespace', () => assert.equal(normaliseWebsite('  www.example.com  '), 'https://www.example.com/'));
  it('rejects non-web schemes', () => assert.equal(normaliseWebsite('javascript:alert(1)'), null));
  it('rejects hosts without a dot', () => assert.equal(normaliseWebsite('localhost'), null));
  it('rejects embedded credentials', () => assert.equal(normaliseWebsite('https://user:pw@example.com'), null));
  it('rejects garbage', () => assert.equal(normaliseWebsite('just words'), null));
  it('rejects empty', () => assert.equal(normaliseWebsite('   '), null));
});

const formOf = (fields: Record<string, string>): FormData => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
};

describe('sourceFrom', () => {
  it('keeps well-formed tags', () =>
    assert.deepEqual(sourceFrom(formOf({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'q4_launch-1' })), {
      source: { utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'q4_launch-1' },
      dropped: [],
    }));
  it('records no tags as direct', () =>
    assert.deepEqual(sourceFrom(formOf({})).source, { utmSource: 'direct', utmMedium: '', utmCampaign: '' }));
  it('treats empty tags as absent, not malformed', () =>
    assert.deepEqual(sourceFrom(formOf({ utm_source: '' })), {
      source: { utmSource: 'direct', utmMedium: '', utmCampaign: '' },
      dropped: [],
    }));
  it('accepts exactly 60 characters', () => assert.equal(sourceFrom(formOf({ utm_source: 'a'.repeat(60) })).source.utmSource, 'a'.repeat(60)));
  it('drops 61 characters', () => assert.deepEqual(sourceFrom(formOf({ utm_source: 'a'.repeat(61) })).dropped, ['utm_source']));
  it('lowercases before validating', () =>
    assert.deepEqual(sourceFrom(formOf({ utm_source: 'LinkedIn', utm_medium: 'CPC', utm_campaign: 'Fall_Audit-2026' })), {
      source: { utmSource: 'linkedin', utmMedium: 'cpc', utmCampaign: 'fall_audit-2026' },
      dropped: [],
    }));
  it('still drops a mixed-case tag with a disallowed character', () =>
    assert.deepEqual(sourceFrom(formOf({ utm_source: 'Google Ads' })).dropped, ['utm_source']));
  for (const bad of ['fall launch', ' cpc', 'a.b', 'e%20mail', 'caf\u00e9', '\u0661\u0662']) {
    it(`drops ${JSON.stringify(bad)}`, () => assert.deepEqual(sourceFrom(formOf({ utm_medium: bad })).dropped, ['utm_medium']));
  }
  it('keeps tagged medium without a source and does not invent direct', () =>
    assert.deepEqual(sourceFrom(formOf({ utm_medium: 'email' })).source, { utmSource: '', utmMedium: 'email', utmCampaign: '' }));
});
