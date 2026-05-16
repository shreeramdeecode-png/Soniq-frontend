import ReportFilterRow from './ReportFilterRow';
import ReportKpiGrid from './ReportKpiGrid';

export default function ReportShell({ report, onDateChange, children }) {
  return (
    <div className="space-y-0">
      {report.filters && (
        <ReportFilterRow filters={report.filters} onDateChange={onDateChange} />
      )}
      {report.kpis?.length > 0 && (
        <ReportKpiGrid kpis={report.kpis} columns={report.kpiColumns ?? 5} />
      )}
      {children}
    </div>
  );
}
