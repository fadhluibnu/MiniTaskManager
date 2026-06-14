export const QUERY_KEYS = {
  actors: {
    all: ['actors'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    detail: (taskId: string) => ['tasks', taskId] as const,
    deleted: ['tasks', 'deleted'] as const,
  },
  auditLogs: {
    all: ['audit-logs'] as const,
    byTask: (taskId: string) => ['audit-logs', 'task', taskId] as const,
  },
} as const
