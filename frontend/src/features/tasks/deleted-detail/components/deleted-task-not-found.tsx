import { Link } from 'react-router-dom'

export default function DeletedTaskNotFound() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        !
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">Deleted task not found</h2>
      <p className="mt-2 text-sm text-slate-500">This task may not exist or is still active.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/deleted-tasks"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to Deleted Tasks
        </Link>
        <Link
          to="/tasks"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-50"
        >
          View Active Tasks
        </Link>
      </div>
    </section>
  )
}
