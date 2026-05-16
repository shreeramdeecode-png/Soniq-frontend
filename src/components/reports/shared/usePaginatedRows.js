import { useMemo, useState } from 'react';

export function usePaginatedRows(rows, { pageSize = 5, totalCount, totalPages: totalPagesProp } = {}) {
  const [page, setPage] = useState(1);
  const total = totalCount ?? rows.length;
  const totalPages = totalPagesProp ?? Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  const paginationProps = {
    activePage: safePage,
    totalPages,
    onPageChange: (p) => setPage(p),
    info: total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`,
  };

  return { pageRows, page: safePage, setPage, paginationProps, totalPages };
}
