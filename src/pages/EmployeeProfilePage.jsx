import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { isLiveActive } from '@/utils/liveStatus';
import ProfileCard from '@/components/cards/employee/ProfileCard';
import ActivityTimeline from '@/components/cards/employee/ActivityTimeline';
import AppUsageTable from '@/components/cards/employee/AppUsageTable';
import AttendanceSummary from '@/components/cards/employee/AttendanceSummary';
import DailyRecordsTable from '@/components/cards/employee/DailyRecordsTable';
import { cn } from '@/utils/cn';

const EMPLOYEE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'screenshots', label: 'Screenshots' },
  { id: 'reports', label: 'App Usage' },
];
import api from '@/utils/api';
import { useToast } from '@/components/ui/Toast';

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const toast = useToast();
  const { teamId, employeeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [miniStats, setMiniStats] = useState([]);
  const [segments, setSegments] = useState([]);
  const [apps, setApps] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [records, setRecords] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    async function fetchEmployeeProfile() {
      setLoading(true);
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 30);
        const fromStr = from.toISOString().slice(0, 10);

        // Fetch multiple endpoints
        const [empRes, attendanceRes, timelineRes, appsRes, screenshotsRes, settingsRes] = await Promise.all([
          api.get(`/api/client/employees/${employeeId}`),
          api.get(`/api/client/attendance/employees/${employeeId}?from=${fromStr}&to=${todayStr}`),
          api.get(`/api/client/attendance/timeline?date=${todayStr}&employeeId=${employeeId}`),
          api.get(`/api/client/reports/app-usage?employeeId=${employeeId}&from=${fromStr}&to=${todayStr}`),
          api.get(`/api/client/screenshots?employeeId=${employeeId}&pageSize=20`),
          api.get(`/api/client/employees/${employeeId}/settings`).catch(() => ({ data: null })),
        ]);

        const empData = empRes.data || {};
        const attHistory = attendanceRes.data || [];
        const timelineData = timelineRes.data || [];
        const rawApps = appsRes.data || [];
        const screenshotItems = screenshotsRes.data?.items || [];

        // 1. Map Profile Card
        const initials = empData.name ? empData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '..';
        // Prisma Decimal serialises as string in JSON — must coerce to Number before summing
        const scoredHistory = attHistory.filter(h => h.productivityScore != null);
        const productivityScore = scoredHistory.length > 0
          ? Math.round(scoredHistory.reduce((acc, h) => acc + Number(h.productivityScore), 0) / scoredHistory.length)
          : 0;

        let prodLabel = 'Average';
        if (productivityScore >= 85) prodLabel = 'Excellent';
        else if (productivityScore >= 70) prodLabel = 'Good';

        let statusText = 'Offline';
        if (isLiveActive(empData)) {
          statusText = 'Active Now';
        }

        // Pick top app as current app
        const topAppItem = rawApps[0];
        const currentApp = topAppItem ? {
          name: topAppItem.appName,
          abbr: topAppItem.appName.slice(0, 2).toUpperCase(),
          iconBg: 'linear-gradient(135deg, #162E24, #0F6E56)',
          iconColor: '#1D9E75',
          category: topAppItem.productivityStatus,
        } : null;

        // Today's record for live stats
        const todayRecord = attHistory.find(h => h.date?.slice?.(0, 10) === todayStr || (h.date && new Date(h.date).toISOString().slice(0, 10) === todayStr));
        const todayCheckIn = todayRecord?.firstCheckin
          ? new Date(todayRecord.firstCheckin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '—';
        const todayWorkHrs = Math.floor((todayRecord?.totalWorkSeconds || 0) / 3600);
        const todayWorkMins = Math.round(((todayRecord?.totalWorkSeconds || 0) % 3600) / 60);
        const activeHrsStr = todayRecord?.totalWorkSeconds
          ? `${todayWorkHrs}h ${todayWorkMins}m today`
          : '—';

        const lastActiveStr = empData.lastSeenAt
          ? (() => {
              const diff = Date.now() - new Date(empData.lastSeenAt).getTime();
              if (diff < 300000) return 'Just now';
              if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
              return new Date(empData.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            })()
          : '—';

        const empIdShort = `EMP-${empData.id.slice(0, 4).toUpperCase()}`;

        const info = [
          { label: 'Employee ID', value: empIdShort },
          { label: 'Designation', value: empData.designation || '—' },
          { label: 'Department', value: empData.department || '—' },
          { label: 'Email', value: empData.email || '—' },
          { label: 'Work Mode', value: empData.workModeType || '—', highlight: true },
          { label: 'Role', value: empData.roleName || 'Employee', highlight: true },
          { label: 'Check In', value: todayCheckIn },
          { label: 'Last Active', value: lastActiveStr, highlight: isLiveActive(empData) },
          { label: 'Active Hours', value: activeHrsStr, highlight: !!todayRecord?.totalWorkSeconds },
          { label: 'Daily Target', value: settingsRes.data?.expectedWorkHoursPerDay != null ? `${Number(settingsRes.data.expectedWorkHoursPerDay)}h / day` : '8h / day' },
        ];

        setProfile({
          name: empData.name || 'Unknown',
          initials,
          role: empData.designation || 'Employee',
          team: empData.teamName || '—',
          status: statusText,
          isWorking: isLiveActive(empData),
          productivityScore,
          productivityLabel: prodLabel,
          avatarBg: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
          avatarColor: '#fff',
          info,
          currentApp,
        });

        // 2. Map timeline segments for today
        const myTimeline = timelineData.find((t) => t.employeeId === employeeId);
        const mySegments = myTimeline?.segments || [];
        // Timeline spans 9 AM – 5 PM local time (28800 s window)
        const TIMELINE_START_SECS = 9 * 3600; // 9 AM in seconds from midnight
        const TIMELINE_DURATION_SECS = 8 * 3600; // 8-hour window

        const mappedSegments = mySegments.map((seg) => {
          const start = new Date(seg.startTime);
          // Use LOCAL time so events seeded at "9 AM IST" land at position 0%
          const startSecs = start.getHours() * 3600 + start.getMinutes() * 60 + start.getSeconds();
          const relativeStart = startSecs - TIMELINE_START_SECS;
          const leftPct = Math.max(0, Math.min(100, (relativeStart / TIMELINE_DURATION_SECS) * 100));
          const widthPct = Math.max(0.5, Math.min(100 - leftPct, (seg.durationSeconds / TIMELINE_DURATION_SECS) * 100));

          let bg = 'rgba(29,158,117,0.35)'; // Neutral — light green
          if (seg.productivityStatus === 'Productive') bg = '#0F6E56';
          else if (seg.productivityStatus === 'Unproductive') bg = '#1A1A1A';
          else if (seg.productivityStatus === 'Idle') bg = 'rgba(29,158,117,0.12)';

          const durMins = Math.round((seg.durationSeconds || 0) / 60);
          const tooltip = `${seg.appName || 'Activity'} · ${durMins}m`;

          return {
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            bg,
            label: seg.appName,
            tooltip,
          };
        });
        setSegments(mappedSegments);

        // 3. Map App Usage Table — exclude sentinel Idle entries
        const mappedApps = rawApps
          .filter(item => item.appName && item.appName !== 'Screen Lock' && item.productivityStatus !== 'Idle')
          .map((item) => {
            const appHrs = Math.floor(item.totalDurationSeconds / 3600);
            const appMins = Math.round((item.totalDurationSeconds % 3600) / 60);
            const isWebsite = !!(item.appDomain || item.appName.includes('.'));
            // For browser visits Trackpilots sends appName="Google Chrome" + the real site in domain
            const displayName = isWebsite && item.appDomain ? item.appDomain : item.appName;

            const category = item.productivityStatus || 'Neutral';
            const statusClass = category === 'Productive' ? 'productive' : category === 'Unproductive' ? 'unproductive' : 'neutral';

            const iconColors =
              category === 'Productive' ? { bg: 'linear-gradient(135deg, #162E24, #0F6E56)', color: '#1D9E75' } :
              category === 'Unproductive' ? { bg: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)', color: '#888' } :
              { bg: 'linear-gradient(135deg, #E8E0C8, #D8CEB0)', color: '#1A1A1A' };

            return {
              name: displayName,
              abbr: displayName.slice(0, 2).toUpperCase(),
              time: appHrs > 0 ? `${appHrs}h ${appMins}m` : `${appMins}m`,
              status: category,
              statusClass,
              isWebsite,
              iconBg: iconColors.bg,
              iconColor: iconColors.color,
              iconUrl: item.appIconUrl || null,
            };
          });
        setApps(mappedApps);

        // 4. Calculate attendance metrics
        const totalDays = attHistory.length || 1;
        const presentDays = attHistory.filter(h => h.isPresent).length;
        const lateDays = attHistory.filter(h => h.isLate).length;
        const absentDays = Math.max(0, totalDays - presentDays);
        const monthlyPct = Math.round((presentDays / totalDays) * 100);
        const onTimeRate = presentDays > 0 ? `${Math.round(((presentDays - lateDays) / presentDays) * 100)}%` : '0%';

        // Extract avg checkin times
        const checkins = attHistory.filter(h => h.firstCheckin).map(h => new Date(h.firstCheckin));
        const checkouts = attHistory.filter(h => h.lastCheckout).map(h => new Date(h.lastCheckout));

        const getAvgTimeStr = (dates) => {
          if (dates.length === 0) return '—';
          const totalMins = dates.reduce((sum, d) => sum + (d.getUTCHours() * 60 + d.getUTCMinutes()), 0);
          const avgMins = Math.round(totalMins / dates.length);
          const h = Math.floor(avgMins / 60);
          const m = avgMins % 60;
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
        };

        const avgCheckIn = getAvgTimeStr(checkins);
        const avgCheckOut = getAvgTimeStr(checkouts);

        setAttendance({
          monthlyPct,
          avgCheckIn,
          avgCheckOut,
          onTimeRate,
          tiles: [
            { label: 'Present', value: String(presentDays), bg: 'rgba(29, 158, 117, 0.05)', border: '1px solid rgba(29,158,117,0.1)' },
            { label: 'Late', value: String(lateDays), bg: 'rgba(217, 119, 6, 0.05)', border: '1px solid rgba(217,119,6,0.1)' },
            { label: 'Absent', value: String(absentDays), bg: 'rgba(229, 62, 62, 0.05)', border: '1px solid rgba(229,62,62,0.1)' },
          ],
        });

        // 5. Map Daily Records
        const mappedRecords = attHistory.slice(-10).reverse().map((record) => {
          const checkInStr = record.firstCheckin 
            ? new Date(record.firstCheckin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '—';
          const checkOutStr = record.lastCheckout 
            ? new Date(record.lastCheckout).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '—';

          const workHrsVal = (record.totalWorkSeconds || 0) / 3600;
          const wHStr = Math.floor(workHrsVal);
          const wMStr = Math.round((workHrsVal % 1) * 60);

          const prodHrsVal = (record.productiveSeconds || 0) / 3600;
          const pHStr = Math.floor(prodHrsVal);
          const pMStr = Math.round((prodHrsVal % 1) * 60);

          const recordDate = new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

          const score = record.productivityScore != null ? Math.round(Number(record.productivityScore)) : 0;
          let scoreBg = 'rgba(29, 158, 117, 0.1)';
          let scoreColor = '#1D9E75';
          if (score < 70) {
            scoreBg = 'rgba(229, 62, 62, 0.1)';
            scoreColor = '#E53E3E';
          }

          let statusText = 'Present';
          let statusBg = 'rgba(29, 158, 117, 0.1)';
          let statusColor = '#0F6E56';

          if (record.isLate) {
            statusText = 'Late';
            statusBg = 'rgba(217, 119, 6, 0.1)';
            statusColor = '#D97706';
          } else if (!record.isPresent) {
            statusText = 'Absent';
            statusBg = 'rgba(229, 62, 62, 0.1)';
            statusColor = '#E53E3E';
          }

          return {
            date: recordDate,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            checkOutHighlight: record.lastCheckout != null,
            totalHrs: `${wHStr}h ${wMStr}m`,
            productive: `${pHStr}h ${pMStr}m`,
            score: `${score}%`,
            scoreBg,
            scoreColor,
            status: statusText,
            statusBg,
            statusColor,
          };
        });
        setRecords(mappedRecords);

        // 6. Map Mini Stat cards
        const totalHrsVal = attHistory.reduce((acc, h) => acc + (h.totalWorkSeconds || 0), 0) / 3600;
        const totalHrsStr = `${Math.floor(totalHrsVal)}h`;
        const totalProdHrsVal = attHistory.reduce((acc, h) => acc + (h.productiveSeconds || 0), 0) / 3600;
        const totalProdHrsStr = `${Math.floor(totalProdHrsVal)}h`;
        const ssCount = attHistory.reduce((acc, h) => acc + (h.screenshotsCount || 0), 0);

        setMiniStats([
          { id: 'total-hrs', value: totalHrsStr, label: 'Work Hours (30d)', bg: 'transparent', border: '1px solid rgba(0,0,0,0.06)' },
          { id: 'productive-hrs', value: totalProdHrsStr, label: 'Productive Hours', bg: 'rgba(29, 158, 117, 0.05)', border: '1px solid rgba(29,158,117,0.1)' },
          { id: 'avg-score', value: `${productivityScore}%`, label: 'Avg Productivity', bg: 'transparent', border: '1px solid rgba(0,0,0,0.06)' },
          { id: 'screenshots', value: String(ssCount), label: 'Screenshots Captured', bg: 'transparent', border: '1px solid rgba(0,0,0,0.06)' },
        ]);

        // 7. Store screenshots items
        setScreenshots(screenshotItems);

      } catch (err) {
        console.error('Error fetching employee profile details:', err);
        toast.error('Failed to load employee profile');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeProfile();
  }, [employeeId]);

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-[2] pb-7 font-poppins">
      {/* Breadcrumb */}
      <div className="px-8 pt-3.5 pb-3 font-poppins">
        <button
          onClick={() => navigate(`/teams/${teamId}`)}
          className="flex items-center gap-1.5 text-sm text-text-light cursor-pointer bg-transparent border-none"
        >
          <ChevronLeft size={13} stroke="#AAA" strokeWidth={2} />
          Dashboard → Teams → {profile?.team} → {profile?.name}
        </button>
      </div>

      {/* Main layout: left profile + right content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3.5 px-8">
        {/* Left: Dark profile card */}
        <ProfileCard profile={profile} />

        {/* Right: Tabs + Content */}
        <div className="flex flex-col gap-3.5 min-w-0">
          {/* Tab bar */}
          <div className="flex items-center gap-0.5 bg-black/5 rounded-[12px] p-[3px] w-fit font-poppins">
            {EMPLOYEE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-[7px] px-4 rounded-[9px] text-sm-plus font-medium cursor-pointer transition-all border-none',
                  activeTab === tab.id
                    ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                    : 'text-text-muted'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-poppins">
            {miniStats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-tile p-[12px_14px]"
                style={{ background: stat.bg, border: stat.border }}
              >
                <div className="text-2xl font-bold text-text-primary tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-2xs-plus text-text-light mt-[3px]">{stat.label}</div>
              </div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <ActivityTimeline segments={segments} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                <AppUsageTable apps={apps} />
                <AttendanceSummary attendance={attendance} />
              </div>
              <DailyRecordsTable records={records} />
            </>
          )}

          {activeTab === 'screenshots' && (
            <div className="rounded-tile bg-white/60 backdrop-blur-sm border border-black/[0.04] p-5 font-poppins">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-text-primary">Screenshots</h3>
                <span className="text-xs text-text-light">{screenshots.length} captured</span>
              </div>
              {screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {screenshots.map((s) => (
                    <div
                      key={s.id}
                      className="group relative rounded-xl overflow-hidden border border-black/[0.06] cursor-pointer bg-black/[0.02] hover:border-primary/30 transition-colors"
                      onClick={() => navigate(`/screenshots/${s.id}`)}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={s.thumbnailUrl || s.imageUrl}
                          alt={s.appName}
                          className={cn('w-full h-full object-cover group-hover:scale-105 transition-transform duration-200', s.isBlurred && 'blur-sm')}
                        />
                      </div>
                      <div className="p-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-text-primary truncate">
                            {s.appName || 'Active Window'}
                          </span>
                          {s.productivityStatus && (
                            <span className={cn(
                              'text-[8px] font-semibold px-[5px] py-px rounded-[4px] shrink-0',
                              s.productivityStatus === 'Productive' ? 'bg-primary/10 text-primary' :
                              s.productivityStatus === 'Unproductive' ? 'bg-ink/10 text-ink' :
                              'bg-black/5 text-text-muted'
                            )}>
                              {s.productivityStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-text-light mt-0.5">
                          {s.capturedAt ? new Date(s.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-text-muted">No screenshots captured yet.</div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <AppUsageTable apps={apps} />
          )}

          {activeTab === 'attendance' && (
            <>
              <AttendanceSummary attendance={attendance} />
              <DailyRecordsTable records={records} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
