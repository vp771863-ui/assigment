export default function Pagination({ page, totalPages, onPage }) {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        className="rounded-lg border px-3 py-2 text-sm"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => onPage(1)}>1</button>
          {start > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {pages.map((item) => (
        <button
          key={item}
          className={`rounded-lg border px-3 py-2 text-sm ${item === page ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => onPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="rounded-lg border px-3 py-2 text-sm"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
