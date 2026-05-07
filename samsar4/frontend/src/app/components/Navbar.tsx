import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, LogOut, Menu, X, Home, ChevronRight, Bell } from 'lucide-react'

import { NotificationsMenu } from './NotificationsMenu'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const transparent = isHome && !scrolled
  const isActive = (p: string) => pathname === p

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      transparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur-xl border-b border-ink/6 shadow-sm py-3'
    }`}>
      <div className="container flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${transparent ? 'bg-teal/20 border border-teal/30' : 'bg-ink'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill={transparent ? '#00C896' : '#00C896'}/>
              <path d="M9 22V12h6v10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={`font-display text-xl font-semibold tracking-tight transition-colors duration-300 ${transparent ? 'text-white' : 'text-ink'}`}>
            SAMSAR
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {[{ l: 'Accueil', p: '/' }, { l: 'Annonces', p: '/properties' }, { l: 'Carte', p: '/map' }].map(lk => (
            <Link key={lk.p} to={lk.p}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive(lk.p)
                  ? 'text-teal font-semibold'
                  : transparent ? 'text-white/75 hover:text-white' : 'text-ink/60 hover:text-ink'
              }`}>
              {lk.l}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === 'agent' && (
                <Link to="/agent/dashboard"
                  className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 ${transparent ? 'text-teal hover:text-teal-light' : 'text-teal hover:text-teal-dark'}`}>
                  <LayoutDashboard className="w-4 h-4"/> Dashboard
                </Link>
              )}
              <NotificationsMenu transparent={transparent} />
              <button onClick={() => { logout(); navigate('/') }}
                className={`p-2 rounded-lg transition-all ${transparent ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-ink/40 hover:text-ink hover:bg-ink/5'}`}>
                <LogOut className="w-4 h-4"/>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className={`text-sm font-medium transition-all ${transparent ? 'text-white/70 hover:text-white' : 'text-ink/60 hover:text-ink'}`}>
                Connexion
              </Link>
              <Link to="/agent/register" className="btn-teal btn-sm text-xs font-bold px-5 py-2.5 rounded-xl">
                Devenir agent <ChevronRight className="w-3.5 h-3.5"/>
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <NotificationsMenu transparent={transparent} />}
          <button onClick={() => setOpen(!open)}
            className={`p-2 rounded-lg transition-all ${transparent ? 'text-white' : 'text-ink'}`}>
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-ink/6 shadow-xl animate-fade-in">
          <div className="container py-5 space-y-1">
            {[{l:'Accueil',p:'/'},{l:'Annonces',p:'/properties'},{l:'Carte',p:'/map'}].map(lk => (
              <Link key={lk.p} to={lk.p} onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(lk.p) ? 'bg-teal/8 text-teal font-semibold' : 'text-ink/70 hover:bg-ink/4 hover:text-ink'}`}>
                {lk.l}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-ink/6 space-y-2">
              {isAuthenticated ? (
                <>
                  {user?.role === 'agent' && <Link to="/agent/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-teal font-semibold text-sm"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>}
                  <button onClick={() => { logout(); navigate('/'); setOpen(false) }} className="flex items-center gap-2 px-4 py-3 text-ink/40 text-sm font-medium"><LogOut className="w-4 h-4"/> Déconnexion</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-center border border-ink/12 rounded-xl text-sm font-medium text-ink">Connexion</Link>
                  <Link to="/agent/register" onClick={() => setOpen(false)} className="btn-teal w-full justify-center rounded-xl">Devenir agent <ChevronRight className="w-4 h-4"/></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
