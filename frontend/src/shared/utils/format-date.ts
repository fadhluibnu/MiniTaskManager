const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '-'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '-'
  return DATE_TIME_FORMATTER.format(date)
}
