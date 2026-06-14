export const MESSAGES = {
  task: {
    created: 'Task has been created successfully.',
    statusUpdated: (status: string) => `Task moved to ${status}.`,
    deleted: 'Task has been moved to deleted tasks.',
  },
  actor: {
    required: 'Please select an actor first.',
  },
  generic: {
    somethingWrong: 'Something went wrong.',
  },
} as const
