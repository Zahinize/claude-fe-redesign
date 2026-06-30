import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ConsentListPage } from '@/features/consent/ConsentListPage'
import { ConsentDetailPage } from '@/features/consent/ConsentDetailPage'
import { DataClassificationPage } from '@/features/classification/DataClassificationPage'
import { RopaDashboardPage } from '@/features/privacy/ropa/RopaDashboardPage'
import { RopaWizardPage } from '@/features/privacy/ropa/RopaWizardPage'
import { RopaDetailPage } from '@/features/privacy/ropa/RopaDetailPage'
import { PlaceholderPage } from '@/features/placeholder/PlaceholderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/consent" replace /> },
      { path: 'consent', element: <ConsentListPage /> },
      { path: 'consent/:id', element: <ConsentDetailPage /> },
      { path: 'governance/data-classification', element: <DataClassificationPage /> },
      { path: 'privacy/ropa', element: <RopaDashboardPage /> },
      { path: 'privacy/ropa/new', element: <RopaWizardPage /> },
      { path: 'privacy/ropa/:id', element: <RopaDetailPage /> },
      { path: 'privacy/ropa/:id/edit', element: <RopaWizardPage /> },
      // Every other governance nav destination renders a placeholder so the
      // shell is fully navigable while the build focuses on Consent Management.
      { path: '*', element: <PlaceholderPage /> },
    ],
  },
])
