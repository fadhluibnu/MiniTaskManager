export default function ActorListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-slate-200 p-5 text-center"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-sm text-slate-500">Loading actors...</p>
    </div>
  )
}
