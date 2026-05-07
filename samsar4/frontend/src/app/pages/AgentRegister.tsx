import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Navbar } from '../components/Navbar'
import { api } from '../../lib/api'
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight,
  User, Phone, Mail, Lock, MapPin, Check, Home, MessageSquare, BarChart2
} from 'lucide-react'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','Salé','Beni Mellal']

/* ── tiny helpers ── */
function ValidDot({ show }: { show: boolean }) {
  return (
    <span className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center
      w-[18px] h-[18px] rounded-full bg-teal transition-all duration-300
      ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3}/>
    </span>
  )
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/25 group-focus-within:text-teal transition-colors duration-200">{children}</span>
}

/* ── password hints ── */
function PwdHint({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${ok ? 'text-teal' : 'text-ink/30'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"/>
      {text}
    </p>
  )
}

/* ── floating stat card ── */
function FloatCard({ icon, label, value, sub, delay, extra }: any) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[.06] backdrop-blur-md hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 cursor-default"
      style={{ animation: `floatCard 6s ${delay}s ease-in-out infinite` }}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${icon.bg}`}>{icon.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-0.5">{label}</p>
        <p className="font-serif text-xl leading-none text-white">{value}</p>
        <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>
      </div>
      {extra}
    </div>
  )
}

/* ══════════════════════════════════════════
   PAYMENT STEP  (unchanged logic, new skin)
══════════════════════════════════════════ */
function PaymentStep({ regData }: { regData: any }) {
  const waMsg = encodeURIComponent(
    `Bonjour ! Je viens de créer mon compte agent SAMSAR.\n\n` +
    `👤 Nom: ${regData?.name}\n📧 Email: ${regData?.email}\n📱 Tél: ${regData?.phone||'N/A'}\n📍 Ville: ${regData?.city||'N/A'}\n\n` +
    `Ci-joint mon reçu de paiement de 349 MAD.\nMerci d'activer mon compte 🙏`
  )
  const waLink = `https://wa.me/212600000000?text=${waMsg}`

  return (
    <div className="min-h-screen bg-pearl-warm">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 py-24 pt-28">
        <div className="w-full max-w-lg">

          {/* stepper */}
          <div className="flex items-center gap-0 mb-10">
            {[{n:1,l:'Inscription'},{n:2,l:'Paiement'},{n:3,l:'Activation'}].map((s,i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s.n < 2 ? 'bg-teal text-white' : s.n === 2 ? 'bg-ink text-white ring-4 ring-ink/15' : 'bg-pearl-mid text-ink/30'
                  }`}>
                    {s.n < 2 ? <Check className="w-4 h-4"/> : s.n}
                  </div>
                  <span className={`text-xs font-semibold ${s.n <= 2 ? 'text-ink' : 'text-ink/30'}`}>{s.l}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${s.n < 2 ? 'bg-teal' : 'bg-pearl-mid'}`}/>}
              </div>
            ))}
          </div>

          {/* success header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex mb-5">
              <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-teal/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-teal"/>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal rounded-full flex items-center justify-center animate-ping-slow"/>
            </div>
            <h1 className="font-display text-4xl text-ink mb-2">Compte créé !</h1>
            <p className="text-ink/45 text-sm">
              Bienvenue <strong className="text-ink">{regData?.name}</strong> — une dernière étape pour activer votre compte.
            </p>
          </div>

          {/* payment card */}
          <div className="card border-ink/8 overflow-hidden mb-4">
            <div className="bg-ink px-7 py-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Montant à régler</p>
                  <p className="font-display text-5xl text-white">349 <span className="text-2xl text-white/40">MAD</span></p>
                  <p className="text-white/30 text-xs mt-1">Abonnement mensuel · 30 jours · annulable</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 justify-end mb-1">
                    {[0,150,300].map(d => (
                      <div key={d} className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{animationDelay:`${d}ms`}}/>
                    ))}
                  </div>
                  <p className="text-white/25 text-xs uppercase tracking-widest">En attente</p>
                </div>
              </div>
            </div>
            <div className="px-7 py-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-ink/40 uppercase tracking-widest mb-3">Coordonnées bancaires — CIH Bank</p>
                <div className="bg-pearl rounded-xl p-4 space-y-3">
                  {[
                    {l:'Banque',       v:'CIH Bank'},
                    {l:'Bénéficiaire', v:'SAMSAR Maroc SARL'},
                    {l:'RIB',          v:'007 780 0001 2345 6789 0 12'},
                    {l:'Montant exact',v:'349,00 MAD'},
                  ].map(r => (
                    <div key={r.l} className="flex justify-between items-center text-sm">
                      <span className="text-ink/40 font-medium">{r.l}</span>
                      <span className="font-mono font-bold text-ink text-xs md:text-sm">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/70 rounded-xl p-4">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">!</div>
                <p className="text-amber-800 text-xs leading-relaxed">
                  Après votre virement, envoyez impérativement votre <strong>reçu de paiement</strong> via WhatsApp pour valider l'activation de votre compte.
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-7 py-5 rounded-2xl font-semibold text-white transition-all duration-300 hover:brightness-105 hover:shadow-xl active:scale-[.98] group mb-3"
            style={{background:'linear-gradient(135deg,#25D366,#128C7E)'}}>
            <div className="flex items-center gap-4">
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <p className="font-bold text-base">Envoyer mon reçu sur WhatsApp</p>
                <p className="text-white/70 text-xs">Ouvre WhatsApp avec message pré-rempli</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0"/>
          </a>

          <p className="text-center text-xs text-ink/30 mb-5">
            Votre compte sera activé dans les <strong className="text-ink/50">24 à 48h</strong> après réception de votre paiement.
          </p>
          <div className="text-center">
            <Link to="/login" className="text-sm text-teal hover:text-teal-dark font-semibold transition-colors">
              J'ai déjà payé → Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export function AgentRegister() {
  const navigate = useNavigate()
  const [step, setStep]     = useState<'form'|'payment'>('form')
  const [regData, setRegData] = useState<any>(null)
  const [form, setForm]     = useState({ name:'', email:'', password:'', phone:'', city:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))

  /* validation helpers */
  const nameOk  = form.name.trim().length > 2
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const phoneOk = form.phone.replace(/\s/g,'').length >= 9
  const lenOk   = form.password.length >= 6
  const numOk   = /[\d\W]/.test(form.password)
  const caseOk  = /[a-z]/.test(form.password) && /[A-Z]/.test(form.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const result = await api.register(form)
      setRegData({ ...form, agentId: result.agent?.id })
      setStep('payment')
    } catch (err: any) { setError(err.message || 'Erreur lors de l\'inscription') }
    finally { setLoading(false) }
  }

  if (step === 'payment') return <PaymentStep regData={regData}/>

  return (
    <>
      {/* keyframes injected once */}
      <style>{`
        @keyframes floatCard {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-20px,18px) scale(1.08); }
        }
        @keyframes blobFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(16px,-16px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-28px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(28px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(45,212,191,.55); }
          70%  { box-shadow: 0 0 0 8px rgba(45,212,191,0); }
          100% { box-shadow: 0 0 0 0 rgba(45,212,191,0); }
        }
        .anim-slide-left  { animation: slideInLeft  .7s cubic-bezier(.22,1,.36,1) both; }
        .anim-slide-right { animation: slideInRight .7s cubic-bezier(.22,1,.36,1) both; }
        .anim-fade-up-1   { animation: fadeUp .55s .18s both; }
        .anim-fade-up-2   { animation: fadeUp .55s .26s both; }
        .anim-fade-up-3   { animation: fadeUp .55s .34s both; }
        .anim-fade-up-4   { animation: fadeUp .55s .40s both; }
        .anim-fade-up-5   { animation: fadeUp .55s .46s both; }
        .anim-fade-up-6   { animation: fadeUp .55s .52s both; }
        .anim-fade-up-7   { animation: fadeUp .55s .58s both; }
        .anim-fade-up-8   { animation: fadeUp .55s .64s both; }
        .live-dot { animation: livePulse 2s infinite; }
        .field-input {
          width:100%; height:46px;
          padding: 0 2.5rem 0 2.75rem;
          border: 1.5px solid rgba(15,25,35,.08);
          border-radius: 12px;
          background: #f4f2ef;
          font-size: .85rem;
          color: #0f1923;
          outline: none;
          transition: border-color .25s, background .25s, box-shadow .25s;
          font-family: inherit;
        }
        .field-input::placeholder { color: rgba(15,25,35,.28); }
        .field-input:focus {
          border-color: #0d9488;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(13,148,136,.1);
        }
        .field-select {
          width:100%; height:46px;
          padding: 0 1rem 0 2.75rem;
          border: 1.5px solid rgba(15,25,35,.08);
          border-radius: 12px;
          background: #f4f2ef;
          font-size: .85rem;
          color: #0f1923;
          outline: none;
          appearance: none;
          transition: border-color .25s, background .25s, box-shadow .25s;
          font-family: inherit;
          cursor: pointer;
        }
        .field-select:focus {
          border-color: #0d9488;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(13,148,136,.1);
        }
        .cta-btn {
          position: relative; overflow: hidden;
          transition: transform .2s, box-shadow .2s;
        }
        .cta-btn::before {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 60%);
        }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(13,148,136,.45)!important; }
        .cta-btn:active { transform:translateY(0); }
        .cta-btn:hover .cta-arrow { transform: translateX(4px); }
        .cta-arrow { transition: transform .25s; }
      `}</style>

      <div className="min-h-screen bg-pearl-warm">
        <Navbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* ── LEFT: FORM ── */}
          <div className="anim-slide-left flex flex-col justify-center px-8 lg:px-16 py-24 pt-28 bg-white relative">

            {/* top bar */}
            <div className="absolute top-7 right-7 text-sm text-ink/50 flex items-center gap-1">
              Déjà membre ?{' '}
              <Link to="/login" className="text-teal font-semibold hover:text-teal-dark transition-colors ml-1">Se connecter</Link>
            </div>

            <div className="w-full max-w-md mx-auto">

              <p className="eyebrow anim-fade-up-1">Inscription</p>
              <h1 className="font-display text-[2.6rem] leading-tight text-ink mb-1 anim-fade-up-2">
                Créer un<br/>compte agent
              </h1>
              <p className="text-ink/45 text-sm mb-8 anim-fade-up-3">
                Rejoignez +350 agents professionnels sur SAMSAR
              </p>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0"/>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Nom */}
                <div className="anim-fade-up-4">
                  <label className="label">Nom complet</label>
                  <div className="relative group mt-1">
                    <FieldIcon><User className="w-[15px] h-[15px]"/></FieldIcon>
                    <input className="field-input" value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Karim Bennani" required/>
                    <ValidDot show={nameOk}/>
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3 anim-fade-up-5">
                  <div>
                    <label className="label">Email</label>
                    <div className="relative group mt-1">
                      <FieldIcon><Mail className="w-[15px] h-[15px]"/></FieldIcon>
                      <input className="field-input" type="email" value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="vous@email.com" required/>
                      <ValidDot show={emailOk}/>
                    </div>
                  </div>
                  <div>
                    <label className="label">Téléphone</label>
                    <div className="relative group mt-1">
                      <FieldIcon><Phone className="w-[15px] h-[15px]"/></FieldIcon>
                      <input className="field-input" value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="+212 6XX XXX XXX"/>
                      <ValidDot show={phoneOk}/>
                    </div>
                  </div>
                </div>

                {/* Ville */}
                <div className="anim-fade-up-6">
                  <label className="label">Ville d'activité</label>
                  <div className="relative group mt-1">
                    <FieldIcon><MapPin className="w-[15px] h-[15px]"/></FieldIcon>
                    <select className="field-select" value={form.city}
                      onChange={e => set('city', e.target.value)}>
                      <option value="">Sélectionnez votre ville</option>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="anim-fade-up-7">
                  <label className="label">Mot de passe</label>
                  <div className="relative group mt-1">
                    <FieldIcon><Lock className="w-[15px] h-[15px]"/></FieldIcon>
                    <input className="field-input pr-10"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setTimeout(() => setPwdFocus(false), 120)}
                      placeholder="Minimum 6 caractères" required minLength={6}/>
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/25 hover:text-ink/60 transition-colors">
                      {showPwd ? <EyeOff className="w-[15px] h-[15px]"/> : <Eye className="w-[15px] h-[15px]"/>}
                    </button>
                  </div>

                  {/* hints slide-down */}
                  <div className={`overflow-hidden transition-all duration-300 ${pwdFocus || form.password ? 'max-h-20 mt-2' : 'max-h-0'}`}>
                    <div className="flex flex-col gap-1">
                      <PwdHint ok={lenOk}  text="Au moins 6 caractères"/>
                      <PwdHint ok={numOk}  text="Un chiffre (0–9) ou symbole"/>
                      <PwdHint ok={caseOk} text="Minuscule (a–z) et majuscule (A–Z)"/>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="cta-btn anim-fade-up-8 mt-1 w-full h-[52px] rounded-[14px] bg-teal text-white font-semibold text-[.9rem] border-none flex items-center justify-center gap-2 shadow-teal disabled:opacity-60 cursor-pointer">
                  {loading
                    ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    : <>Créer mon compte <ArrowRight className="cta-arrow w-4 h-4"/></>}
                </button>

              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-ink/8"/>
                <span className="text-xs text-ink/30">ou</span>
                <div className="flex-1 h-px bg-ink/8"/>
              </div>

              <p className="text-center text-sm text-ink/40">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-teal hover:text-teal-dark font-semibold transition-colors">Se connecter</Link>
              </p>
            </div>
          </div>

          {/* ── RIGHT: VISUAL PANEL ── */}
          <div className="anim-slide-right hidden lg:flex relative overflow-hidden items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #0f1923 0%, #0f2a26 50%, #0b1f2e 100%)' }}>

            {/* blobs */}
            <div className="absolute pointer-events-none"
              style={{ width:420, height:420, top:-80, right:-80, borderRadius:'50%',
                background:'radial-gradient(circle, rgba(13,148,136,.55) 0%, transparent 70%)',
                filter:'blur(70px)', animation:'blobFloat 9s ease-in-out infinite' }}/>
            <div className="absolute pointer-events-none"
              style={{ width:280, height:280, bottom:60, left:-40, borderRadius:'50%',
                background:'radial-gradient(circle, rgba(45,212,191,.3) 0%, transparent 70%)',
                filter:'blur(70px)', animation:'blobFloat2 11s ease-in-out infinite' }}/>

            {/* dot grid */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage:'radial-gradient(rgba(255,255,255,.055) 1px, transparent 1px)', backgroundSize:'28px 28px' }}/>

            {/* orbit icons */}
            {[
              { emoji:'🏠', top:'12%', right:'8%',  delay:'0s' },
              { emoji:'📍', top:'68%', right:'6%',  delay:'1s' },
              { emoji:'💬', top:'28%', left:'6%',   delay:'2s' },
              { emoji:'📊', bottom:'14%', left:'8%',delay:'.5s'},
            ].map((o, i) => (
              <div key={i} className="absolute w-11 h-11 rounded-[14px] flex items-center justify-center text-lg pointer-events-none"
                style={{ ...o, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)',
                  backdropFilter:'blur(10px)', animation:`floatCard 6s ${o.delay} ease-in-out infinite` }}>
                {o.emoji}
              </div>
            ))}

            {/* content */}
            <div className="relative z-10 flex flex-col items-center gap-8 px-10 text-center">
              <div>
                <p className="text-[11px] font-bold tracking-[.18em] uppercase text-teal-glow/80 mb-4">Plateforme #1 au Maroc</p>
                <h2 className="font-display text-[2.8rem] leading-[1.15] text-white">
                  Votre activité<br/>mérite la<br/><em className="italic text-teal-glow">meilleure vitrine.</em>
                </h2>
              </div>

              {/* stat cards */}
              <div className="flex flex-col gap-3 w-full max-w-[300px]">
                {[
                  { icon:{ bg:'bg-teal/25', emoji:'💰' }, label:'Abonnement mensuel', value:'349 MAD', sub:'Annulable à tout moment', delay: 0 },
                  { icon:{ bg:'bg-amber-400/20', emoji:'⚡' }, label:'Délai d\'activation', value:'24 h', sub:'Après réception du paiement', delay: 1.5 },
                  { icon:{ bg:'bg-blue-400/20', emoji:'∞' }, label:'Annonces', value:'Illimitées', sub:'100 % données sécurisées', delay: 3,
                    extra: (
                      <div className="flex items-center gap-1.5 text-[11px] text-teal-glow font-semibold">
                        <span className="live-dot w-2 h-2 rounded-full bg-teal-glow flex-shrink-0"/>Live
                      </div>
                    )
                  },
                ].map((c, i) => <FloatCard key={i} {...c}/>)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}