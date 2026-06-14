import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found - Mini Task Manager'
  }, [])

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          'radial-gradient(circle at top, rgba(15, 23, 42, 0.04), transparent 24rem), #f8fafc',
      }}
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-medium text-slate-500">Mini Task Manager</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">404</h1>
        <p className="mt-1 text-base font-semibold text-slate-950">Page not found</p>
        <p className="mt-2 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist yet. It may be part of an upcoming
          iteration.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/tasks"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Tasks
          </Link>
        </div>
      </section>
    </main>
  )
}
