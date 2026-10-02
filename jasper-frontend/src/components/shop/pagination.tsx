export function Pagination({
  page,
  totalPages,
  onPageChange
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
    const start = Math.min(Math.max(1, page - 2), Math.max(1, totalPages - 4));
    return start + index;
  });

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        className="btn-wine-secondary px-4 py-2 text-xs font-bold uppercase"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        type="button"
      >
        Previous
      </button>
      {visiblePages.map((pageNumber) => (
        <button
          className={`min-w-9 border text-xs font-bold uppercase px-3 py-2 ${pageNumber === page ? "btn-primary" : "btn-wine-secondary"}`}
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          type="button"
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="btn-wine-secondary px-4 py-2 text-xs font-bold uppercase"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        type="button"
      >
        Next
      </button>
    </div>
  );
}
