import GlossyCard from '@/components/ui/GlossyCard';

export default function DailyRecordsTable({ records = [] }) {
  const headers = ['Date', 'Check In', 'Check Out', 'Total Hrs', 'Productive', 'Score', 'Status'];

  return (
    <GlossyCard className="p-4">
      <h4 className="text-md font-semibold text-text-primary mb-3">Recent Daily Records</h4>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-xs font-semibold text-text-light uppercase tracking-wide py-[7px] px-2.5 text-left border-b border-black/[0.06] font-poppins">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((row, i) => (
                <tr key={i} className="font-poppins">
                  <td className="py-[9px] px-2.5 text-sm font-medium text-text-primary border-b border-black/[0.04] last:border-b-0">
                    {row.date}
                  </td>
                  <td className="py-[9px] px-2.5 text-[11px] text-text-secondary border-b border-black/[0.04]">
                    {row.checkIn}
                  </td>
                  <td className={`py-[9px] px-2.5 text-[11px] border-b border-black/[0.04] font-medium ${row.checkOutHighlight ? 'text-primary-light' : 'text-text-secondary'}`}>
                    {row.checkOut}
                  </td>
                  <td className="py-[9px] px-2.5 text-[11px] font-semibold text-text-primary border-b border-black/[0.04]">
                    {row.totalHrs}
                  </td>
                  <td className="py-[9px] px-2.5 text-[11px] font-semibold text-text-primary border-b border-black/[0.04]">
                    {row.productive}
                  </td>
                  <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                    <span
                      className="inline-flex py-0.5 px-2 rounded-lg text-xs font-bold font-poppins"
                      style={{ background: row.scoreBg, color: row.scoreColor }}
                    >
                      {row.score}
                    </span>
                  </td>
                  <td className="py-[9px] px-2.5 border-b border-black/[0.04]">
                    <span
                      className="text-xs font-medium py-0.5 px-[7px] rounded-lg font-poppins"
                      style={{ background: row.statusBg, color: row.statusColor }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-xs text-text-light font-poppins">
                  No attendance records logged.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlossyCard>
  );
}
