import GlossyCard from '@/components/ui/GlossyCard';
import { orgHealth } from '@/mock/dashboard';
import { cn } from '@/utils/cn';

function HealthTile({ value, label, change, positive, variant }) {
  return (
    <div
      className={cn(
        'rounded-tile p-[11px_12px]',
        variant === 'primary'
          ? 'bg-gradient-to-br from-primary/10 to-primary/[0.04] border border-primary/[0.18]'
          : 'bg-gradient-to-br from-ink/[0.06] to-ink/[0.02] border border-ink/10'
      )}
    >
      <div className="text-2xl font-bold text-text-primary tracking-tight leading-none">
        {value}
      </div>
      <div className="text-2xs-plus text-text-light mt-[3px]">{label}</div>
      <div
        className={cn(
          'text-2xs-plus font-semibold mt-0.5',
          positive ? 'text-primary-light' : 'text-text-muted'
        )}
      >
        {change}
      </div>
    </div>
  );
}

export default function OrgHealthCard() {
  const { status, tiles } = orgHealth;

  return (
    <GlossyCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">Org Health</h3>
        <span className="primary-badge rounded-[20px] py-[3px] px-[11px] text-xs-plus font-bold text-white">
          {status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => (
          <HealthTile key={tile.label} {...tile} />
        ))}
      </div>
    </GlossyCard>
  );
}
