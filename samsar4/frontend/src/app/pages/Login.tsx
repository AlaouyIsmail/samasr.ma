import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/Navbar'
import { Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [remember, setRemember] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  const doLogin = async (e: string, p: string) => {
    setError(''); setLoading(true)
    try {
      await login(e, p)
      const raw = localStorage.getItem('samsar_token')!
      const payload = JSON.parse(atob(raw.split('.')[1]))
      navigate(payload.role === 'admin' ? '/portail-gestion-s4ms4r-2026' : '/agent/dashboard')
    } catch (err: any) { setError(err.message || 'Identifiants invalides') }
    finally { setLoading(false) }
  }

  const handleSubmit = (e: any) => { e.preventDefault(); doLogin(email, password) }

  return (
    <>
      <style>{`
        @keyframes floatY  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes floatY2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
        @keyframes floatY3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatY4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes pulseRing { 0%{transform:scale(0.85);opacity:.5} 100%{transform:scale(1.5);opacity:0} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        .f1{animation:floatY  5s ease-in-out infinite}
        .f2{animation:floatY2 6.5s ease-in-out infinite .8s}
        .f3{animation:floatY3 7s ease-in-out infinite 1.5s}
        .f4{animation:floatY4 4.5s ease-in-out infinite 2s}
        .su{animation:slideUp .55s ease forwards}
        .fi{animation:fadeIn .4s ease forwards}
      `}</style>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]" style={{ background: '#F7F6F3' }}>
              <Navbar />
        {/* ── LEFT : FORM ── */}
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-12 min-h-screen">
       
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-14 fi" style={{ animationDelay: '0s', opacity: 0 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0A0F1E' }}>
              <div className="w-3 h-3 rounded-sm" style={{ background: '#00C896' }} />
            </div>
            <span className="font-black text-lg" style={{ color: '#0A0F1E', letterSpacing: '-0.04em' }}>SAMSAR</span>
          </div>

          {/* Heading */}
          <div className="mb-8 su" style={{ animationDelay: '0.08s', opacity: 0 }}>
            <h1 className="font-display font-black mb-2"
              style={{ fontSize: '2.7rem', letterSpacing: '-0.055em', color: '#0A0F1E', lineHeight: 1.05 }}>
              Holla,<br />Bon retour 👋
            </h1>
            <p className="text-sm" style={{ color: 'rgba(10,15,30,0.42)' }}>
              Connectez-vous à votre espace professionnel
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 su" style={{ animationDelay: '0.16s', opacity: 0 }}>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                style={{ color: focusedField === 'email' ? '#00C896' : 'rgba(10,15,30,0.22)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                required placeholder="stanley@gmail.com"
                style={{
                  width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '14px', paddingBottom: '14px',
                  borderRadius: '14px', fontSize: '14px', fontWeight: 500, outline: 'none',
                  background: 'white', color: '#0A0F1E',
                  border: `1.5px solid ${focusedField === 'email' ? 'rgba(0,200,150,0.55)' : 'rgba(10,15,30,0.1)'}`,
                  boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(0,200,150,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'border-color .2s, box-shadow .2s',
                }} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                style={{ color: focusedField === 'password' ? '#00C896' : 'rgba(10,15,30,0.22)' }} />
              <input type={showPwd ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                required placeholder="••••••••••••"
                style={{
                  width: '100%', paddingLeft: '2.75rem', paddingRight: '3rem', paddingTop: '14px', paddingBottom: '14px',
                  borderRadius: '14px', fontSize: '14px', fontWeight: 500, outline: 'none',
                  background: 'white', color: '#0A0F1E',
                  border: `1.5px solid ${focusedField === 'password' ? 'rgba(0,200,150,0.55)' : 'rgba(10,15,30,0.1)'}`,
                  boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(0,200,150,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'border-color .2s, box-shadow .2s',
                }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
                style={{ color: 'rgba(10,15,30,0.3)' }}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setRemember(!remember)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: remember ? '#00C896' : 'white',
                    border: `1.5px solid ${remember ? '#00C896' : 'rgba(10,15,30,0.2)'}`,
                    boxShadow: remember ? '0 0 0 3px rgba(0,200,150,0.15)' : 'none',
                  }}>
                  {remember && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(10,15,30,0.45)' }}>Se souvenir de moi</span>
              </label>
              <button type="button" className="text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: '#00C896' }}>
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 font-bold text-sm py-4 rounded-2xl transition-all duration-300 disabled:opacity-60"
              style={{
                background: '#00C896', color: 'white',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(0,200,150,0.38)',
                transform: loading ? 'scale(0.985)' : 'scale(1)',
                letterSpacing: '0.02em',
              }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connexion…</>
                : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-sm text-center mt-8 su" style={{ animationDelay: '0.28s', opacity: 0, color: 'rgba(10,15,30,0.38)' }}>
            Pas de compte ?{' '}
            <Link to="/agent/register" className="font-bold hover:opacity-70 transition-opacity" style={{ color: '#00C896' }}>
              Créer un compte
            </Link>
          </p>
        </div>

        {/* ── RIGHT : ILLUSTRATION ── */}
        <div className="hidden lg:flex relative overflow-hidden items-center justify-center"
          style={{ background: 'linear-gradient(145deg, #06111c 0%, #0d2e22 50%, #081828 100%)' }}>

          {/* Glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute rounded-full" style={{ width:600,height:600,top:'-180px',right:'-120px', background:'radial-gradient(circle,rgba(0,200,150,0.18) 0%,transparent 65%)' }}/>
            <div className="absolute rounded-full" style={{ width:500,height:500,bottom:'-80px',left:'-100px', background:'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 65%)' }}/>
          </div>

          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity:.06 }}>
            <defs><pattern id="dp" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dp)"/>
          </svg>

          {/* ── SCENE ── */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">

            {/* Clouds */}
            <div className="f3 absolute" style={{ top:'7%', left:'5%' }}>
              <svg width="100" height="58" viewBox="0 0 100 58" fill="none">
                <ellipse cx="50" cy="40" rx="46" ry="18" fill="white" opacity=".92"/>
                <ellipse cx="32" cy="30" rx="25" ry="21" fill="white" opacity=".92"/>
                <ellipse cx="66" cy="25" rx="30" ry="23" fill="white" opacity=".92"/>
              </svg>
            </div>
            <div className="f2 absolute" style={{ top:'10%', right:'6%' }}>
              <svg width="78" height="46" viewBox="0 0 78 46" fill="none">
                <ellipse cx="39" cy="32" rx="36" ry="14" fill="white" opacity=".88"/>
                <ellipse cx="24" cy="24" rx="19" ry="16" fill="white" opacity=".88"/>
                <ellipse cx="52" cy="20" rx="23" ry="18" fill="white" opacity=".88"/>
              </svg>
            </div>
            <div className="f4 absolute" style={{ bottom:'12%', left:'3%' }}>
              <svg width="64" height="38" viewBox="0 0 64 38" fill="none">
                <ellipse cx="32" cy="28" rx="30" ry="10" fill="white" opacity=".75"/>
                <ellipse cx="20" cy="20" rx="16" ry="13" fill="white" opacity=".75"/>
                <ellipse cx="44" cy="16" rx="19" ry="15" fill="white" opacity=".75"/>
              </svg>
            </div>

            {/* ── PHONE ── */}
            <div className="f1 relative" style={{ width:260, height:360, zIndex:10 }}>
              <div className="absolute inset-0 rounded-[36px]"
                style={{
                  background:'linear-gradient(160deg,#0e3527,#0b2030)',
                  border:'2px solid rgba(0,200,150,0.28)',
                  boxShadow:'0 40px 100px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>
                {/* Screen */}
                <div className="absolute inset-[7px] rounded-[30px] overflow-hidden flex flex-col items-center justify-center gap-5 p-6"
                  style={{ background:'linear-gradient(160deg,#0f3d2c,#0c2234)' }}>
                  {/* Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full" style={{ background:'rgba(0,0,0,0.55)' }}/>

                  {/* App icon */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mt-4"
                    style={{ background:'rgba(0,200,150,0.14)', border:'1px solid rgba(0,200,150,0.3)' }}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                      <path d="M17 3L31 14V31H3V14L17 3Z" fill="rgba(0,200,150,0.25)" stroke="#00C896" strokeWidth="1.5"/>
                      <rect x="12" y="19" width="10" height="12" rx="1" fill="#00C896" opacity=".75"/>
                      <rect x="9" y="14" width="7" height="7" rx="1" fill="#00C896" opacity=".5"/>
                      <rect x="18" y="14" width="7" height="7" rx="1" fill="#00C896" opacity=".5"/>
                    </svg>
                  </div>

                  {/* Fingerprint */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-teal-400 opacity-20" style={{ animation:'pulseRing 2s ease-out infinite' }}/>
                    <div className="absolute inset-2 rounded-full border border-teal-400 opacity-25" style={{ animation:'pulseRing 2s ease-out infinite .6s' }}/>
                    <div className="w-13 h-13 rounded-full flex items-center justify-center"
                      style={{ width:52,height:52, background:'rgba(0,200,150,0.18)', border:'1.5px solid rgba(0,200,150,0.45)' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
                        <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
                        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
                        <path d="M2 12a10 10 0 0 1 18-6"/>
                        <path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/>
                        <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/>
                        <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
                        <path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>
                      </svg>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full px-2">
                    <div className="w-full h-1.5 rounded-full" style={{ background:'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width:'72%', background:'linear-gradient(90deg,#00C896,#0ea5e9)', boxShadow:'0 0 10px rgba(0,200,150,0.5)' }}/>
                    </div>
                    <p className="text-center mt-1.5 font-medium" style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px' }}>Authentification sécurisée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FLOATING CARDS ── */}

            {/* Location */}
            <div className="f2 absolute" style={{ top:'24%', left:'5%' }}>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
                style={{ background:'white', boxShadow:'0 12px 40px rgba(0,0,0,0.22)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(0,200,150,0.12)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-black" style={{ color:'#0A0F1E', fontSize:'11px' }}>Marrakech</p>
                  <p style={{ color:'rgba(10,15,30,0.4)', fontSize:'10px' }}>48 annonces</p>
                </div>
              </div>
            </div>

            {/* Check */}
            <div className="f4 absolute" style={{ top:'18%', right:'6%' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background:'white', boxShadow:'0 12px 40px rgba(0,0,0,0.2)' }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="13" fill="rgba(0,200,150,0.14)"/>
                  <path d="M8 13.5L11.5 17L18 10" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Lock */}
            <div className="f3 absolute" style={{ bottom:'28%', right:'5%' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background:'white', boxShadow:'0 16px 48px rgba(0,0,0,0.22)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="5" y="13" width="18" height="12" rx="3" fill="#0A0F1E" opacity=".85"/>
                  <path d="M9 13V10a5 5 0 0 1 10 0v3" stroke="#0A0F1E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <circle cx="14" cy="18" r="2" fill="white"/>
                  <rect x="13" y="18" width="2" height="3" rx="1" fill="white"/>
                </svg>
              </div>
            </div>

            {/* Stats pill */}
            <div className="f1 absolute" style={{ bottom:'24%', left:'4%' }}>
              <div className="px-4 py-3 rounded-2xl" style={{ background:'#00C896', boxShadow:'0 12px 40px rgba(0,200,150,0.42)' }}>
                <p className="font-black text-white" style={{ fontSize:'18px', letterSpacing:'-0.04em', lineHeight:1 }}>1 200+</p>
                <p className="font-medium mt-0.5" style={{ color:'rgba(255,255,255,0.72)', fontSize:'10px' }}>Annonces actives</p>
              </div>
            </div>

            {/* ── PERSON SVG ── */}
            <div className="f2 absolute" style={{ bottom:0, left:'50%', transform:'translateX(-45%)', zIndex:20 }}>
              <svg width="190" height="210" viewBox="0 0 190 210" fill="none">
                {/* Shadow */}
                <ellipse cx="95" cy="205" rx="42" ry="5" fill="rgba(0,0,0,0.18)"/>
                {/* Legs */}
                <path d="M84 158 L75 192 L87 192 L95 165 L103 192 L115 192 L106 158Z" fill="#0A0F1E"/>
                {/* Shoes */}
                <ellipse cx="81" cy="194" rx="10" ry="4.5" fill="#111827"/>
                <ellipse cx="109" cy="194" rx="10" ry="4.5" fill="#111827"/>
                {/* Jacket body */}
                <path d="M68 112 L122 112 L125 162 L65 162Z" fill="#00C896"/>
                {/* Collar */}
                <path d="M95 112 L84 128 L95 132 L106 128Z" fill="rgba(255,255,255,0.28)"/>
                {/* Left arm */}
                <path d="M68 118 L48 150 L60 154 L76 124Z" fill="#00C896"/>
                <ellipse cx="48" cy="152" rx="7" ry="6" fill="#FBBF24" transform="rotate(-10 48 152)"/>
                {/* Right arm reaching */}
                <path d="M122 118 L148 142 L140 149 L112 126Z" fill="#00C896"/>
                <ellipse cx="148" cy="144" rx="7" ry="6" fill="#FBBF24" transform="rotate(30 148 144)"/>
                {/* Head */}
                <ellipse cx="95" cy="90" rx="26" ry="28" fill="#FBBF24"/>
                {/* Hair */}
                <path d="M69 84 Q72 60 95 58 Q118 60 121 84 Q114 68 95 66 Q76 68 69 84Z" fill="#1C1917"/>
                {/* Eyes */}
                <ellipse cx="86" cy="91" rx="3.2" ry="3.8" fill="#1C1917"/>
                <ellipse cx="104" cy="91" rx="3.2" ry="3.8" fill="#1C1917"/>
                <circle cx="87.5" cy="89.5" r="1.1" fill="white"/>
                <circle cx="105.5" cy="89.5" r="1.1" fill="white"/>
                {/* Smile */}
                <path d="M87 101 Q95 108 103 101" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                {/* Bag */}
                <path d="M68 122 Q56 148 62 164" stroke="#065F46" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <rect x="44" y="152" width="26" height="22" rx="5" fill="#065F46"/>
                <rect x="50" y="158" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
                <rect x="50" y="163" width="14" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
              </svg>
            </div>

          </div>

          {/* Bottom credit */}
          <div className="absolute bottom-7 left-0 right-0 text-center z-10">
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'11px', fontWeight:500 }}>
              © 2026 SAMSAR · Immobilier Maroc
            </p>
          </div>
        </div>

      </div>
    </>
  )
}