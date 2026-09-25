// Interpolation de couleur dans l'espace perceptuel OKLCH — évite la zone
// grisâtre/terne qui apparaît au milieu d'un simple mix RGB entre 2 teintes
// éloignées (ex: crème → terracotta). Formules de référence : Björn Ottosson
// (OKLab) / spec CSS Color 4.
function srgbToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const cs = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, cs)) * 255);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

function oklabToOklch(L: number, a: number, b: number): [number, number, number] {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

function oklchToOklab(L: number, C: number, H: number): [number, number, number] {
  const hr = (H * Math.PI) / 180;
  return [L, C * Math.cos(hr), C * Math.sin(hr)];
}

function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  const [L, a, ob] = rgbToOklab(r, g, b);
  return oklabToOklch(L, a, ob);
}

function oklchToRgbString(L: number, C: number, H: number): string {
  const [ol, oa, ob] = oklchToOklab(L, C, H);
  const [r, g, b] = oklabToRgb(ol, oa, ob);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Interpole 2 couleurs hex dans l'espace OKLCH, t ∈ [0,1]. Gère le tour de
 * teinte (H) par le chemin le plus court plutôt qu'un lerp linéaire brut. */
export function interpolateOklch(hexFrom: string, hexTo: string, t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const [L1, C1, H1] = hexToOklch(hexFrom);
  const [L2, C2, H2] = hexToOklch(hexTo);

  let dH = H2 - H1;
  if (dH > 180) dH -= 360;
  else if (dH < -180) dH += 360;

  const L = L1 + (L2 - L1) * clamped;
  const C = C1 + (C2 - C1) * clamped;
  const H = H1 + dH * clamped;

  return oklchToRgbString(L, C, H);
}
