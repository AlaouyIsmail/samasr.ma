import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: string }) {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-pearl flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto"/>
        <p className="font-display text-xl text-ink/30">Chargement...</p>
      </div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return <>{children}</>
}
