import { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import api from '@/utils/api';

const STATUS_COLOR = {
  productive: '#0F6E56',
  idle: '#C8C8C0',
  unproductive: '#1A1A1A',
};

function FeedItem({ name, app, time, status, thumbBg, thumbStroke, onClick }) {
  const dotColor = STATUS_COLOR[status] || '#C8C8C0';
  const showGlow = status === 'productive';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-[9px] py-2 border-b border-black/[0.04] last:border-b-0 last:pb-0 cursor-pointer rounded-lg hover:bg-black/[0.02] transition-colors font-poppins"
    >
      <div
        className="thumb-sheen w-12 h-[34px] rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{ background: thumbBg }}
      >
        <Monitor size={16} stroke={thumbStroke} strokeWidth={2} className="relative z-10" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-text-primary truncate">{name}</div>
        <div className="text-xs text-text-light mt-px truncate">{app || 'Active Session'}</div>
      </div>
      <div className="flex flex-col items-end gap-[3px] shrink-0 ml-2">
        <span className="text-2xs-plus text-text-lighter">{time}</span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: dotColor,
            boxShadow: showGlow ? '0 0 4px rgba(0,0,0,0.2)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function ScreenshotFeedCard() {
  const [feed, setFeed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchScreenshots() {
      try {
        const res = await api.get('/api/client/dashboard/recent-screenshots?limit=4');
        const items = res.data || [];

        const mappedFeed = items.map((item) => {
          const status = (item.productivityStatus || 'Idle').toLowerCase();

          let thumbBg = 'linear-gradient(135deg, #C0C0B8, #A8A8A0)';
          let thumbStroke = 'rgba(255, 255, 255, 0.7)';

          if (status === 'productive') {
            thumbBg = 'linear-gradient(135deg, #162E24, #0F6E56)';
            thumbStroke = 'rgba(29, 158, 117, 0.8)';
          } else if (status === 'unproductive') {
            thumbBg = 'linear-gradient(135deg, #3A3520, #2A2818)';
            thumbStroke = 'rgba(245, 197, 24, 0.5)';
          }

          const date = new Date(item.capturedAt);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            id: item.id,
            name: item.employeeName || 'Unknown',
            app: item.appName || 'Active Window',
            time: timeStr,
            status,
            thumbBg,
            thumbStroke,
          };
        });

        setFeed(mappedFeed);
      } catch (err) {
        console.error('Error fetching screenshot feed:', err);
      }
    }

    fetchScreenshots();
    const interval = setInterval(fetchScreenshots, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlossyCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-primary">Screenshot Feed</h3>
        <div className="flex items-center gap-[5px]">
          <div className="w-[5px] h-[5px] rounded-full bg-primary animate-pulse" />
          <span className="text-xs-plus text-text-muted">Live</span>
        </div>
      </div>

      {feed.length > 0 ? (
        feed.map((item) => (
          <FeedItem key={item.id} {...item} onClick={() => navigate(`/screenshots/${item.id}`)} />
        ))
      ) : (
        <div className="text-xs text-text-light py-8 text-center font-poppins">
          No screenshots recorded today.
        </div>
      )}

      <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-black/5">
        <div className="flex gap-2.5">
          {[
            { label: 'Productive', color: '#0F6E56' },
            { label: 'Idle', color: '#C8C8C0' },
            { label: 'Unproductive', color: '#1A1A1A' },
          ].map((legend) => (
            <div key={legend.label} className="flex items-center gap-1 text-2xs-plus text-text-muted font-poppins">
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: legend.color }} />
              {legend.label}
            </div>
          ))}
        </div>
        <span onClick={() => navigate('/screenshots')} className="text-xs text-text-light cursor-pointer hover:text-primary transition-colors font-poppins">View All →</span>
      </div>
    </GlossyCard>
  );
}

