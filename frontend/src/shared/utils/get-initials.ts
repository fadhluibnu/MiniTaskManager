export function getInitials(name: string): string {
  if (!name) return ''

  return (
    name
      .split(' ')
      .map((word) => word[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || '--'
  )
}
