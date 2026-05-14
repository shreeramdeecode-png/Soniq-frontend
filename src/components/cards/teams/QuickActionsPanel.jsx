import { Monitor, FileText, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlossyCard from '@/components/ui/GlossyCard';
import { quickActions } from '@/mock/teamDetail';
import { useToast } from '@/components/ui/Toast';

const ICONS = {
  monitor: Monitor,
  file: FileText,
  'user-plus': UserPlus,
};

const ACTION_HANDLERS = {
  'View Screenshots': (navigate) => navigate('/screenshots'),
  'Generate Report': (navigate) => navigate('/reports'),
};

export default function QuickActionsPanel() {
  const navigate = useNavigate();
  const toast = useToast();

  function handleAction(label) {
    const handler = ACTION_HANDLERS[label];
    if (handler) {
      handler(navigate);
    } else {
      toast.info('Feature coming soon');
    }
  }

  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-3">Quick Actions</h4>
      <div className="flex flex-col gap-2">
        {quickActions.map((action) => {
          const Icon = ICONS[action.icon];
          return (
            <div
              key={action.label}
              onClick={() => handleAction(action.label)}
              className="flex items-center gap-2.5 py-2.5 px-3 bg-[#F8F8F5] rounded-[10px] cursor-pointer border border-black/5 hover:bg-white/80 transition-colors"
            >
              <Icon size={14} stroke="#1A1A1A" strokeWidth={2} />
              <span className="text-sm font-medium text-text-primary">{action.label}</span>
              <ChevronRight size={11} stroke="#CCC" strokeWidth={2} className="ml-auto" />
            </div>
          );
        })}
      </div>
    </GlossyCard>
  );
}
