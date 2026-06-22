import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ConsentListPage } from '@/features/consent/ConsentListPage'
import { ConsentDetailPage } from '@/features/consent/ConsentDetailPage'
import { PlaceholderPage } from '@/features/placeholder/PlaceholderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/consent" replace /> },
      { path: 'consent', element: <ConsentListPage /> },
      { path: 'consent/:id', element: <ConsentDetailPage /> },
      // Every other governance nav destination renders a placeholder so the
      // shell is fully navigable while the build focuses on Consent Management.
      { path: '*', element: <PlaceholderPage /> },
    ],
  },
])
