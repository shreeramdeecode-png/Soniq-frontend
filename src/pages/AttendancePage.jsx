import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Download, Calendar } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import AttendanceListTable from '@/components/cards/attendance/AttendanceListTable';
import AttendanceGantt from '@/components/cards/attendance/AttendanceGantt';
import { attendanceStats, attendanceTabs, legend } from '@/mock/attendance';
import { cn } from '@/utils/cn';

export default function AttendancePage() {
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="relative z-[2]">
      {/* Page Header */}
      <div className="flex items-end justify-between px-8 pt-3.5 pb-3">
        <div>
          <div className="text-xs-plus text-text-light mb-[3px]">Dashboard → Attendance</div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            {viewMode === 'list' ? 'Attendance' : 'Attendance — Timeline View'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass-pill flex items-center gap-1.5 py-2 px-4 rounded-pill text-sm font-medium text-text-secondary cursor-pointer">
            <Download size={12} stroke="#666" strokeWidth={2} />
            Export CSV
          </button>
          <button className="primary-pill flex items-center gap-1.5 py-2 px-4 rounded-pill text-sm font-semibold text-white cursor-pointer">
            <Calendar size={12} stroke="#fff" strokeWidth={2} />
            Apr 16, 2026
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3 px-8 pb-3.5">
        {attendanceStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2.5 px-8 pb-3.5 flex-wrap">
        {/* Date nav */}
        <div className="glass-pill flex items-center gap-2 h-9 px-1.5 rounded-pill">
          <button className="w-6 h-6 rounded-full border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60">
            <ChevronLeft size={10} stroke="#888" strokeWidth={2} />
          </button>
          <span className="text-sm-plus font-semibold text-text-primary px-2 whitespace-nowrap">Wednesday, Apr 16, 2026</span>
          <button className="w-6 h-6 rounded-full border border-black/[0.08] flex items-center justify-center cursor-pointer bg-white/60">
            <ChevronRight size={10} stroke="#888" strokeWidth={2} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0.5 bg-black/5 rounded-[10px] p-[3px]">
          {attendanceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-1.5 px-3.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-white text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : 'text-text-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="glass-pill flex items-center gap-[7px] h-9 px-3.5 rounded-pill text-sm text-text-lighter min-w-[180px]">
          <Search size={12} stroke="#CCC" strokeWidth={2} />
          Search employee...
        </div>

        {/* View toggle */}
        <div className="flex gap-0.5 bg-black/5 rounded-[10px] p-[3px] ml-auto">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'py-[5px] px-3 rounded-lg text-[11px] font-medium cursor-pointer whitespace-nowrap transition-all',
              viewMode === 'list'
                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-text-muted'
            )}
          >
            ≡ List View
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={cn(
              'py-[5px] px-3 rounded-lg text-[11px] font-medium cursor-pointer whitespace-nowrap transition-all',
              viewMode === 'gantt'
                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-text-muted'
            )}
          >
            ⧖ Timeline Gantt
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3.5 px-8 pb-3 flex-wrap">
        <span className="text-xs text-text-light font-medium mr-1">Legend:</span>
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-[5px] text-xs text-text-muted">
            <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: item.bg }} />
            {item.label}
          </div>
        ))}
        <div className="flex items-center gap-[5px] text-xs text-text-muted">
          <div className="w-2.5 h-2.5 bg-ink rounded-[1px]" />
          Shift Start
        </div>
        <div className="flex items-center gap-[5px] text-xs text-text-muted">
          <div className="w-2.5 h-2.5 bg-text-muted/50 rounded-[1px]" />
          Shift End
        </div>
        {viewMode === 'gantt' && (
          <div className="flex items-center gap-[5px] text-xs text-primary-light font-semibold">
            <div className="w-0.5 h-3 rounded-[1px]" style={{ background: 'linear-gradient(180deg, #1D9E75, rgba(29,158,117,0.3))' }} />
            Now (2:41 PM)
          </div>
        )}
      </div>

      {/* Content: List or Gantt */}
      {viewMode === 'list' ? <AttendanceListTable /> : <AttendanceGantt />}
    </div>
  );
}
