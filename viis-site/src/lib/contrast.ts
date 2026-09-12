/**
 * WCAG 2.x relative luminance and contrast ratio.
 * Used at build time by the design-system specimen so the ratios shown
 * are computed from the live token values, never typed in by hand.
 */

const HEX = /^#?([0-9a-f]{6})$/i;

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function parseHex(hex: string): [number, number, number] {
  const match = HEX.exec(hex.trim());
  if (!match) throw new Error(`contrast: expected a 6-digit hex colour, got "${hex}"`);
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type AaLevel = 'AA' | 'AA large' | 'fail';

/** 4.5:1 for body text, 3:1 for large text and UI boundaries. */
export function aaLevel(ratio: number): AaLevel {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'fail';
}

/** Composite an rgba() colour over an opaque hex ground, returning hex. */
export function composite(rgba: string, over: string): string {
  const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/i.exec(rgba);
  if (!m) throw new Error(`contrast: expected rgba(), got "${rgba}"`);
  const alpha = m[4] === undefined ? 1 : Number(m[4]);
  const ground = parseHex(over);
  const out = [m[1], m[2], m[3]].map((v, i) =>
    Math.round(alpha * Number(v) + (1 - alpha) * ground[i]),
  );
  return '#' + out.map((v) => v.toString(16).padStart(2, '0')).join('');
}
