import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import { attendance } from '@/mock/dashboard';

const BLOCKS = [
  { key: 'checkedIn', label: 'Checked In', className: 'pblock-primary text-white' },
  { key: 'absent', label: 'Absent', className: 'pblock-dark text-white' },
  { key: 'privacy', label: 'Privacy', className: 'pblock-gray text-white' },
];

export default function AttendanceCard() {
  const { percentage, checkedIn, absent, privacy } = attendance;
  const counts = { checkedIn, absent, privacy };
  const navigate = useNavigate();

  return (
    <GlossyCard className="p-4.5 cursor-pointer" onClick={() => navigate('/attendance')}>
      <div className="flex items-start justify-between mb-2.5">
        <h3 className="text-lg font-semibold text-text-primary">Attendance</h3>
        <span className="text-4xl font-bold text-text-primary tracking-tight">
          {percentage}%
        </span>
      </div>
      <div className="flex gap-[7px]">
        {BLOCKS.map(({ key, label, className }) => (
          <div key={key} className="flex-1 flex flex-col gap-1">
            <span className="text-xs-plus text-text-muted">{counts[key]}</span>
            <div className={`h-10 rounded-[10px] flex items-center justify-center text-xs font-semibold ${className}`}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}
