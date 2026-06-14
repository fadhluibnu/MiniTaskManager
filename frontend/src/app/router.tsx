import { createBrowserRouter } from 'react-router-dom'
import SelectActorPage from '@/pages/select-actor-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SelectActorPage />,
  },
])
