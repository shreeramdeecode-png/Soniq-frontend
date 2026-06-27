import ReportLineChart from './ReportLineChart';

/** Work Pulse hourly productivity — Chart.js-style area line */
export default function ProductivityHourChart(props) {
  return <ReportLineChart yTickStep={25} ySuffix="%" showFill tension={0.4} {...props} />;
}
