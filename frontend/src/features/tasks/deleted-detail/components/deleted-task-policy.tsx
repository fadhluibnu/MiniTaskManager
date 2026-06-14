const POLICIES = [
  {
    title: 'Soft Delete',
    description: 'Task data is retained using deletedAt metadata.',
  },
  {
    title: 'Read Only',
    description: 'Deleted tasks cannot be moved or deleted again from this page.',
  },
  {
    title: 'Audit Visible',
    description: 'Audit logs remain visible after the task is deleted.',
  },
] as const

export default function DeletedTaskPolicy() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Deleted Task Policy</h2>
        <p className="mt-1 text-sm text-slate-500">
          Based on the system design, deleted tasks are not considered active and are displayed
          through a dedicated deleted task path.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {POLICIES.map((policy) => (
          <div key={policy.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">{policy.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{policy.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
