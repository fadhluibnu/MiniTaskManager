import { Link } from 'react-router-dom'
import ActorBadge from '@/features/actors/components/actor-badge'
import type { ActorCardData } from '@/features/actors/types/actor'

interface PageHeaderProps {
  actor: ActorCardData | null
}

const NAV_LINKS = [
  { label: 'Change Actor', to: '/select-actor' },
  { label: 'Deleted Tasks', to: '/deleted-tasks' },
  { label: 'Audit Trail', to: '/audit-logs' },
] as const

export default function PageHeader({ actor }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-medium text-slate-500">Mini Task Manager</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Task Manager</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Create active tasks, move status forward, delete tasks, and search task data quickly.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <ActorBadge actor={actor} />

        <div className="flex flex-wrap gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
