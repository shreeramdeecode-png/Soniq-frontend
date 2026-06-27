function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadReportExport(reportId, format = 'csv') {
  const date = new Date().toISOString().slice(0, 10);
  const csv = `Report ID,Export Date\n${reportId},${date}\nNote,Export this report via the Export CSV button above for live data\n`;
  const ext = format === 'csv' ? 'csv' : 'xls';
  const mime = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.ms-excel;charset=utf-8';
  downloadBlob(csv, `${reportId}-report-${date}.${ext}`, mime);
  return true;
}
