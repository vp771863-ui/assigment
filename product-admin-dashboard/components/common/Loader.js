export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-slate-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      <span>{text}</span>
    </div>
  );
}
