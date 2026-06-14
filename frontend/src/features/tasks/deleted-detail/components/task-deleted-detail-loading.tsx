export default function TaskDeletedDetailLoading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-sm text-slate-500">Loading deleted task detail...</p>
    </section>
  )
}
