export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">{message || "Something went wrong."}</p>
      {onRetry && (
        <button className="btn-danger mt-4" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
