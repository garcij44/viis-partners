import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normaliseWebsite } from '../src/lib/validate';

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
