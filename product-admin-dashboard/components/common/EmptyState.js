export default function EmptyState({ message = "No products found." }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
      {message}
    </div>
  );
}
