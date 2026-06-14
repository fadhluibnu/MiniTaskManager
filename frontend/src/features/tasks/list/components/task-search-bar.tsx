import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TaskSearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export default function TaskSearchBar({ value, onChange, onClear }: TaskSearchBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          Search
        </span>
        <Input
          type="search"
          placeholder="Search by title, description, status, or creator"
          className="h-11 w-full rounded-lg border-slate-300 bg-white py-2 pl-[4.25rem] pr-3 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onClear}
        disabled={!value}
        className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
      >
        Clear Search
      </Button>
    </div>
  )
}
