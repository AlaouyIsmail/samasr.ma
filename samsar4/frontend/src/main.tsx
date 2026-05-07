import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthProvider } from './app/context/AuthContext'
import { Home } from './app/pages/Home'
import { Properties } from './app/pages/Properties'
import { PropertyDetail } from './app/pages/PropertyDetail'
import { Login } from './app/pages/Login'
import { AgentRegister } from './app/pages/AgentRegister'
import { PaymentPending } from './app/pages/PaymentPending'
import { AgentDashboard } from './app/pages/AgentDashboard'
import { AdminPanel } from './app/pages/AdminPanel'
import { MapView } from './app/pages/MapView'
import { AgentProfilePublic } from './app/pages/AgentProfilePublic'
import { ProtectedRoute } from './app/components/ProtectedRoute'
import './styles/index.css'

const ADMIN_PATH = 'portail-gestion-s4ms4r-2026'

const router = createBrowserRouter([
  { path: '/',                      Component: Home },
  { path: '/properties',            Component: Properties },
  { path: '/property/:id',          Component: PropertyDetail },
  { path: '/agent-profile/:id',     Component: AgentProfilePublic },
  { path: '/map',                   Component: MapView },
  { path: '/login',                 Component: Login },
  { path: '/agent/register',        Component: AgentRegister },
  { path: '/agent/payment-pending', Component: PaymentPending },
  { path: '/agent/dashboard', element: <ProtectedRoute role="agent"><AgentDashboard /></ProtectedRoute> },
  { path: `/${ADMIN_PATH}`,  element: <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute> },
  { path: '/admin', element: <div className="min-h-screen bg-pearl-warm flex items-center justify-center"><p className="font-display text-8xl text-ink/8">404</p></div> },
  { path: '*',     element: <div className="min-h-screen bg-pearl-warm flex items-center justify-center"><p className="font-display text-8xl text-ink/8">404</p></div> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
