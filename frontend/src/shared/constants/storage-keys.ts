export const STORAGE_KEYS = {
  selectedActor: 'selectedActor',
  previewTasks: 'previewTasks',
  previewAuditLogs: 'previewAuditLogs',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
