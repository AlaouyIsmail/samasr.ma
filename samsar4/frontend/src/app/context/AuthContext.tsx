import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../../lib/api'

interface AuthContextType {
  user: any; agent: any; token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean; loading: boolean
  refreshAgent: () => Promise<void>
}
const Ctx = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('samsar_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('samsar_token'))

  useEffect(() => {
    if (!token) { setLoading(false); return }
    api.me().then(({ user: u, agent: a }) => { setUser(u); setAgent(a) })
      .catch(() => { localStorage.removeItem('samsar_token'); setToken(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { token: t, user: u, agent: a } = await api.login({ email, password })
    localStorage.setItem('samsar_token', t)
    setToken(t); setUser(u); setAgent(a)
  }

  const logout = () => {
    localStorage.removeItem('samsar_token')
    setToken(null); setUser(null); setAgent(null)
  }

  const refreshAgent = async () => {
    if (!token) return
    const { agent: a } = await api.me()
    setAgent(a)
  }

  return (
    <Ctx.Provider value={{ user, agent, token, login, logout, isAuthenticated: !!user, loading, refreshAgent }}>
      {children}
    </Ctx.Provider>
  )
}
export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
