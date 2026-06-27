import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import api from '@/utils/api';

const BLOCKS = [
  { key: 'checkedIn', label: 'Checked In', className: 'pblock-primary text-white' },
  { key: 'absent', label: 'Absent', className: 'pblock-dark text-white' },
  { key: 'activeNow', label: 'Active Now', className: 'pblock-gray text-white' },
];

export default function AttendanceCard({ from: propFrom, to: propTo }) {
  const [data, setData] = useState({
    percentage: 0,
    counts: { checkedIn: 0, absent: 0, privacy: 0 },
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const params = new URLSearchParams();
        if (propFrom) params.set('from', propFrom instanceof Date ? propFrom.toISOString().slice(0, 10) : propFrom);
        if (propTo) params.set('to', propTo instanceof Date ? propTo.toISOString().slice(0, 10) : propTo);
        const qs = params.toString() ? `?${params}` : '';
        const res = await api.get(`/api/client/dashboard/stats${qs}`);
        const stats = res.data;

        const total = stats.totalEmployees || 0;
        const present = stats.presentToday || 0;
        const absent = Math.max(0, total - present);
        const activeNow = stats.activeNow || 0;

        const pct = total > 0 ? Math.round((present / total) * 100) : 0;

        setData({
          percentage: pct,
          counts: { checkedIn: present, absent, activeNow },
        });
      } catch (err) {
        console.error('Error loading attendance stats:', err);
      }
    }

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 30000);
    return () => clearInterval(interval);
  }, [propFrom, propTo]);

  return (
    <GlossyCard className="p-4.5 cursor-pointer" onClick={() => navigate('/attendance')}>
      <div className="flex items-start justify-between mb-2.5">
        <h3 className="text-lg font-semibold text-text-primary">Attendance</h3>
        <span className="text-4xl font-bold text-text-primary tracking-tight font-poppins">
          {data.percentage}%
        </span>
      </div>
      <div className="flex gap-[7px]">
        {BLOCKS.map(({ key, label, className }) => (
          <div key={key} className="flex-1 flex flex-col gap-1 font-poppins">
            <span className="text-xs-plus text-text-muted">{data.counts[key]}</span>
            <div className={`h-10 rounded-[10px] flex items-center justify-center text-xs font-semibold ${className}`}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </GlossyCard>
  );
}

