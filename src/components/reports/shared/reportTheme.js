/** Soniq report palette — green only (site primary) */
export const RT = {
  green: '#0F6E56',
  greenLight: '#1D9E75',
  greenDark: '#085041',
  greenDeep: '#0A5040',
  greenPale: '#EAF2EE',
  greenSoft: '#F0F9F4',
  greenMuted: 'rgba(15,110,86,0.08)',
  greenBorder: 'rgba(15,110,86,0.18)',
  greenFill: 'rgba(15,110,86,0.12)',
  barGradient: 'linear-gradient(90deg, #1D9E75, #0F6E56)',
  barGradientV: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
  chipActive: 'bg-gradient-to-br from-[#0F6E56] to-[#1D9E75] text-white border-[#0F6E56]',
  /** Semantic aliases — all map to green scale */
  warn: '#1D9E75',
  danger: '#085041',
  dangerSoft: 'rgba(15,110,86,0.1)',
  accentMuted: '#85C4B0',
  track: '#F0F0E8',
  textMuted: '#888888',
  chartBar: (opacity) => `rgba(15,110,86,${opacity})`,
  chartBarDark: (opacity) => `rgba(8,80,65,${opacity})`,
};

/** Opacity steps for multi-series / distribution charts */
export const CHART_GREENS = [
  'rgba(15,110,86,0.35)',
  'rgba(15,110,86,0.45)',
  'rgba(15,110,86,0.55)',
  'rgba(15,110,86,0.65)',
  'rgba(15,110,86,0.75)',
  'rgba(29,158,117,0.7)',
  'rgba(8,80,65,0.85)',
];

export function heatColorGreen(value) {
  const a = value / 100;
  if (value >= 80) return `rgba(15,110,86,${a})`;
  if (value >= 60) return `rgba(29,158,117,${a * 0.75})`;
  if (value >= 40) return `rgba(29,158,117,${a * 0.45})`;
  return 'rgba(240,240,232,0.85)';
}

export const HEAT_LEGEND = [
  '#F0F0E8',
  'rgba(15,110,86,.15)',
  'rgba(15,110,86,.35)',
  'rgba(15,110,86,.55)',
  'rgba(15,110,86,.75)',
  '#0F6E56',
];
