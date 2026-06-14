import { createBrowserRouter } from 'react-router-dom'
import NotFoundPage from '@/pages/not-found-page'
import SelectActorPage from '@/pages/select-actor-page'
import TaskDetailPage from '@/pages/task-detail-page'
import TaskManagerPage from '@/pages/task-manager-page'

export const router = createBrowserRouter([
  { path: '/', element: <SelectActorPage /> },
  { path: '/select-actor', element: <SelectActorPage /> },
  { path: '/tasks', element: <TaskManagerPage /> },
  { path: '/tasks/:taskId', element: <TaskDetailPage /> },
  { path: '*', element: <NotFoundPage /> },
])
