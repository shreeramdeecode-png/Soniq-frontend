import { Outlet } from 'react-router-dom';
import TopNav from '@/components/common/TopNav';

export default function DashboardLayout() {
  return (
    <div className="page-bg">
      <div className="shell">
        <TopNav />
        <Outlet />
      </div>
    </div>
  );
}
