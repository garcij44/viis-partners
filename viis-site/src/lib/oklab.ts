/**
 * sRGB ↔ OKLab / OKLCH (Björn Ottosson's reference constants).
 * Used at build time by the design-system specimen to describe field
 * colours and gradient midpoints perceptually. Not shipped to the browser.
 */
import { parseHex } from './contrast';

export interface Oklch {
  L: number;
  C: number;
  H: number;
}

const linear = (c: number): number => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const gamma = (c: number): number => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
};

export function toOklab(hex: string): [number, number, number] {
  const [r, g, b] = parseHex(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function fromOklab([L, a, b]: [number, number, number]): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gamma);
  return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function toOklch(hex: string): Oklch {
  const [L, a, b] = toOklab(hex);
  const H = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { L, C: Math.hypot(a, b), H };
}

/** Straight-line mix in OKLab, t from 0 (a) to 1 (b) — what `in oklab` gradients do. */
export function mixOklab(a: string, b: string, t: number): string {
  const x = toOklab(a);
  const y = toOklab(b);
  return fromOklab([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}
