import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ROUTES } from '@/constants/routes';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TeamsListPage = lazy(() => import('@/pages/TeamsListPage'));
const TeamDetailPage = lazy(() => import('@/pages/TeamDetailPage'));
const EmployeeProfilePage = lazy(() => import('@/pages/EmployeeProfilePage'));
const ScreenshotsPage = lazy(() => import('@/pages/ScreenshotsPage'));
const ScreenshotDetailPage = lazy(() => import('@/pages/ScreenshotDetailPage'));
const AttendancePage = lazy(() => import('@/pages/AttendancePage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.TEAMS} element={<TeamsListPage />} />
          <Route path={ROUTES.TEAMS_DETAIL} element={<TeamDetailPage />} />
          <Route path={ROUTES.TEAMS_EMPLOYEE} element={<EmployeeProfilePage />} />
          <Route path={ROUTES.SCREENSHOTS} element={<ScreenshotsPage />} />
          <Route path={ROUTES.SCREENSHOTS_DETAIL} element={<ScreenshotDetailPage />} />
          <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
