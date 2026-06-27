import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import { isLiveActive } from '@/utils/liveStatus';
import { useToast } from '@/components/ui/Toast';
import ScreenshotViewer from '@/components/cards/screenshots/ScreenshotViewer';
import FilmStrip from '@/components/cards/screenshots/FilmStrip';
import ScreenshotDetailPanel from '@/components/cards/screenshots/ScreenshotDetailPanel';
import api, { BACKEND_URL } from '@/utils/api';

const toAbsUrl = (url) => url && url.startsWith('/') ? `${BACKEND_URL}${url}` : url;

function getIconType(appName = '') {
  if (!appName) return 'monitor';
  const name = appName.toLowerCase();
  if (name.includes('code') || name.includes('vs') || name.includes('intellij') || name.includes('terminal')) return 'code';
  if (name.includes('chrome') || name.includes('firefox') || name.includes('safari') || name.includes('browser') || name.includes('website') || name.includes('globe')) return 'globe';
  if (name.includes('slack')) return 'monitor';
  if (name.includes('clock') || name.includes('idle') || name.includes('no activity')) return 'clock';
  return 'monitor';
}

function getBgStyle(id) {
  const gradients = [
    'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
    'linear-gradient(135deg, #252520, #1E1E18)',
    'linear-gradient(135deg, #1E1E1E, #282828)',
    'linear-gradient(135deg, #3A3520, #2A2818)',
    'linear-gradient(135deg, #2B1B3D, #1A1128)',
    'linear-gradient(135deg, #1A1A2E, #16213E)',
    'linear-gradient(135deg, #2D2B55, #1E1B3D)',
    'linear-gradient(135deg, #00274D, #001B36)',
    'linear-gradient(135deg, #1A3A5C, #0F2640)',
    'linear-gradient(135deg, #03363D, #022B31)',
  ];
  let sum = 0;
  for (let i = 0; i < String(id).length; i++) {
    sum += String(id).charCodeAt(i);
  }
  return gradients[sum % gradients.length];
}

export default function ScreenshotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [shot, setShot] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [allShots, setAllShots] = useState([]);

  const currentIndex = allShots.findIndex(s => String(s.id) === String(id));

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let activeShot = null;
        let empDetails = null;
        let empShots = [];

        const res = await api.get(`/api/client/screenshots/${id}`);
        const found = res.data;

        if (!found) {
          toast.error('Screenshot not found');
          navigate('/screenshots');
          return;
        }

        const timeStr = new Date(found.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date(found.capturedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });

        activeShot = {
          id: found.id,
          employeeId: found.employeeId,
          time: `${timeStr} · ${dateStr}`,
          app: `${found.appName || 'Active Window'} · ${found.appDomain || 'Application'}`,
          category: found.isIdle ? 'idle' : (found.productivityStatus || 'neutral').toLowerCase(),
          blurred: found.isBlurred,
          idle: found.isIdle,
          bgStyle: getBgStyle(found.id),
          imageUrl: toAbsUrl(found.imageUrl),
          thumbnailUrl: toAbsUrl(found.thumbnailUrl),
          iconType: getIconType(found.appName),
        };

        const [empRes, attRes] = await Promise.all([
          api.get(`/api/client/employees/${found.employeeId}`),
          api.get(`/api/client/attendance/employees/${found.employeeId}?from=${new Date().toISOString().slice(0, 10)}&to=${new Date().toISOString().slice(0, 10)}`),
        ]);

        const empData = empRes.data || {};
        const attToday = attRes.data?.[0] || {};
        const initials = empData.name ? empData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '..';

        empDetails = {
          name: empData.name,
          initials,
          role: empData.designation || 'Employee',
          team: empData.teamName || '—',
          status: isLiveActive(empData) ? 'Active' : 'Offline',
          avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
          avatarColor: '#fff',
          checkIn: attToday.firstCheckin
            ? new Date(attToday.firstCheckin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—',
          todayScore: attToday.productivityScore != null ? `${Math.round(Number(attToday.productivityScore))}%` : '—',
          shotsToday: String(attToday.screenshotsCount ?? 0),
          os: empData.operatingSystem || 'Windows 11',
          workType: empData.workModeType || 'Office',
        };

        const listRes = await api.get(`/api/client/screenshots?employeeId=${found.employeeId}&pageSize=50`);
        empShots = (listRes.data?.items || []).map(s => {
          const tStr = new Date(s.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            id: s.id,
            employeeId: s.employeeId,
            time: tStr,
            app: `${s.appName || 'Active Window'} · ${s.appDomain || 'Application'}`,
            category: s.isIdle ? 'idle' : (s.productivityStatus || 'neutral').toLowerCase(),
            blurred: s.isBlurred,
            idle: s.isIdle,
            bgStyle: getBgStyle(s.id),
            imageUrl: toAbsUrl(s.imageUrl),
            thumbnailUrl: toAbsUrl(s.thumbnailUrl),
            iconType: getIconType(s.appName),
          };
        });

        setShot(activeShot);
        setEmployee(empDetails);
        setAllShots(empShots);
      } catch (err) {
        console.error('Failed to load screenshot details:', err);
        toast.error('Failed to load screenshot details');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [id]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/screenshots/${allShots[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allShots.length - 1) {
      navigate(`/screenshots/${allShots[currentIndex + 1].id}`);
    }
  };

  const handleSelect = (selectedId) => {
    navigate(`/screenshots/${selectedId}`);
  };

  const handleDownload = () => {
    if (shot?.imageUrl) {
      window.open(shot.imageUrl, '_blank');
    } else {
      toast.error('Screenshot not available');
    }
  };

  const handleToggleBlur = async () => {
    if (!shot) return;
    const newBlur = !shot.blurred;
    try {
      await api.patch(`/api/client/screenshots/${shot.id}/blur`, { blur: newBlur });
      setShot(prev => ({ ...prev, blurred: newBlur }));
      setAllShots(prev => prev.map(s => s.id === shot.id ? { ...s, blurred: newBlur } : s));
      toast.success(newBlur ? 'Screenshot blurred successfully' : 'Screenshot unblurred successfully');
    } catch (err) {
      console.error('Failed to update screenshot blur:', err);
      toast.error('Failed to update screenshot blur');
    }
  };

  if (loading || !shot) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-[2] pb-6 font-poppins">
      {/* Page header */}
      <div className="flex items-center gap-3.5 px-9 pt-3 pb-2.5">
        <button
          onClick={() => navigate('/screenshots')}
          className="glass-pill flex items-center gap-1.5 py-[7px] px-3.5 rounded-pill text-sm-plus font-medium text-text-secondary cursor-pointer whitespace-nowrap shrink-0 border-none bg-white/60 hover:bg-white/90"
        >
          <ChevronLeft size={12} stroke="#666" strokeWidth={2} />
          Back to grid
        </button>
        <div className="text-[11px] text-text-light whitespace-nowrap overflow-hidden text-ellipsis">
          Screenshots → <span className="text-text-primary font-medium">{employee?.name}</span> → <span className="text-text-primary font-medium">{shot?.time}</span>
        </div>
        <button 
          onClick={handleDownload} 
          className="ml-auto shrink-0 glass-pill flex items-center gap-[5px] py-[7px] px-4 rounded-pill text-sm text-text-secondary cursor-pointer whitespace-nowrap border-none bg-white/60 hover:bg-white/90"
        >
          <Download size={11} stroke="#666" strokeWidth={2} />
          Download
        </button>
      </div>

      {/* Lightbox area */}
      <div className="grid grid-cols-[1fr_286px] gap-3 px-9">
        {/* Left column */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <ScreenshotViewer 
            shot={shot} 
            currentIndex={currentIndex} 
            total={allShots.length} 
            onPrev={handlePrev} 
            onNext={handleNext} 
            onDownload={handleDownload} 
          />
          <FilmStrip 
            items={allShots} 
            activeId={shot.id} 
            onSelect={handleSelect} 
          />
        </div>

        {/* Right panel */}
        <ScreenshotDetailPanel 
          shot={shot} 
          employee={employee} 
          onToggleBlur={handleToggleBlur} 
        />
      </div>
    </div>
  );
}
