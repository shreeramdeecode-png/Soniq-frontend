/** Settings palette — site green only (aligned with reports) */
export { RT } from '../reports/shared/reportTheme';

export const ST = {
  green: '#0F6E56',
  greenLight: '#1D9E75',
  greenDark: '#085041',
  greenDeep: '#0A5040',
  greenPale: '#EAF2EE',
  greenSoft: '#F0F9F4',
  greenMuted: 'rgba(15,110,86,0.08)',
  greenBorder: 'rgba(15,110,86,0.18)',
  greenFill: 'rgba(15,110,86,0.12)',
};

export const CHIP_STYLES = {
  default: 'bg-black/5 text-text-muted border border-black/[0.08]',
  warn: 'bg-primary/10 text-[#0F6E56] border border-primary/20',
  danger: 'bg-[rgba(15,110,86,.12)] text-[#085041] border border-[rgba(15,110,86,.22)]',
  merged: 'bg-[rgba(15,110,86,.08)] text-[#085041] border border-[rgba(15,110,86,.18)]',
  purple: 'bg-[rgba(15,110,86,.1)] text-[#0F6E56] border border-[rgba(15,110,86,.2)]',
};

export const ROLE_BADGE = {
  Admin: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  Manager: { bg: 'bg-[rgba(29,158,117,.1)]', text: 'text-[#0F6E56]', border: 'border-[rgba(15,110,86,.2)]' },
  Employee: { bg: 'bg-neutral-warm/40', text: 'text-text-secondary', border: 'border-black/5' },
  'No Access': { bg: 'bg-[rgba(15,110,86,.06)]', text: 'text-[#085041]', border: 'border-[rgba(15,110,86,.15)]' },
};

export const STATUS_BADGE = {
  active: { dot: 'bg-primary', label: 'Active', badge: 'bg-primary/10 text-primary' },
  pending: { dot: 'bg-[#1D9E75]', label: 'Pending EXE', badge: 'bg-[rgba(29,158,117,.12)] text-[#0F6E56]' },
  inactive: { dot: 'bg-[#85C4B0]', label: 'Inactive', badge: 'bg-[rgba(15,110,86,.08)] text-[#085041]' },
};

export const ROLE_META_BADGE = {
  dn: 'bg-neutral-warm/40 text-text-muted',
  db: 'bg-[rgba(29,158,117,.12)] text-[#0F6E56]',
  dp: 'bg-[rgba(15,110,86,.1)] text-[#085041]',
};
