import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { Navbar } from '../components/Navbar'
import { PropertyCard } from '../components/PropertyCard'
import { api, formatPrice } from '../../lib/api'
import {
  Search, MapPin, ArrowRight, ChevronDown, TrendingUp, Shield,
  Zap, Star, CheckCircle, Users, BarChart3, FileText,
  MessageCircle, Building2, Home as HomeIcon, ChevronRight,
  Heart,
  Bed,
  Bath,
  Square,
  Sparkles,
  Rocket,
  ShieldCheck,
  LayoutDashboard,
  Map,
  ImageIcon,
  Headphones,
  BadgeCheck,
  Quote,
  Globe,
  UserPlus,
  LogIn,
} from 'lucide-react'
import CountUp from "react-countup";

const CITIES = ['Toutes les villes', 'Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Fès', 'Agadir']
const PROP_TYPES = [
  { icon: '🏢', label: 'Appartement', val: 'apartment' },
  { icon: '🏡', label: 'Villa', val: 'villa' },
  { icon: '🕌', label: 'Riad', val: 'riad' },
  { icon: '🌿', label: 'Terrain', val: 'land' },
  { icon: '🏪', label: 'Commercial', val: 'commercial' },
]
const TESTIMONIALS = [
  { name: 'Karim B.', city: 'Casablanca', text: 'Grâce à SAMSAR, j\'ai multiplié mes contacts par 3 en deux mois. L\'interface est intuitive et les stats me donnent une vraie vision de mon activité.', rating: 5, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  { name: 'Fatima A.', city: 'Marrakech', text: 'La génération automatique de contrats m\'économise des heures chaque semaine. Vraiment bluffant pour le prix demandé.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
  { name: 'Youssef I.', city: 'Rabat', text: 'La carte interactive permet à mes clients de trouver exactement ce qu\'ils cherchent. Mon taux de conversion a explosé.', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
]
const BRANDS = ['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Tétouan', 'El Jadida']
const FEATURES = [
  { icon: BarChart3, title: 'Analytics temps réel', desc: 'Vues, likes, clics WhatsApp — tout suivi par annonce en direct.' },
  { icon: FileText, title: 'Contrats automatiques', desc: 'Compromis, location, mandat — générés et signés en un clic.' },
  { icon: MapPin, title: 'Carte interactive', desc: 'Vos biens géolocalisés sur une carte Maroc enrichie.' },
  { icon: MessageCircle, title: 'WhatsApp natif', desc: 'Bouton contact WhatsApp sur chaque annonce avec message pré-rempli.' },
  { icon: Shield, title: 'Sécurité maximale', desc: 'JWT, RBAC, données chiffrées — votre compte est protégé.' },
  { icon: Zap, title: 'Activation en 24h', desc: 'Envoyez votre reçu, votre compte est actif en moins de 24h.' },
]

export function Home() {
  const [props, setProps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [propType, setPropType] = useState('')
  const [txType, setTxType] = useState('SALE')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    api.getProperties('limit=6').then(r => setProps(r.data || [])).catch(() => { }).finally(() => setLoading(false))
    const t = setInterval(() => setActiveTestimonial(n => (n + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const onSearch = (e: any) => {
    e.preventDefault()
    const q = new URLSearchParams()
    if (city && city !== 'Toutes les villes') q.set('city', city)
    if (propType) q.set('propertyType', propType)
    q.set('type', txType)
    navigate(`/properties?${q}`)
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* ══════════════════════ HERO ══════════════════════ */}
     <section className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden">
  {/* Background image */}
  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
      alt=""
      className="w-full h-full object-cover opacity-25"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A]/95 via-[#060D1A]/80 to-[#060D1A]/40" />
  </div>

  {/* Grid pattern */}
  <div className="absolute inset-0 bg-grid opacity-100" />

  {/* Glow orbs */}
  <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-teal/5 blur-[100px] pointer-events-none" />
  <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-teal/8 blur-[80px] pointer-events-none animate-float" />

  {/* Content */}
  <div className="relative z-10 container pt-24 pb-16">
    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-7 animate-fade-in">
        <div className="flex items-center gap-1.5 bg-teal/12 border border-teal/20 px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-ping-slow" />

          <span className="text-teal text-xs font-bold tracking-widest uppercase">
            Plateforme SaaS Immobilière
          </span>
        </div>
      </div>

      {/* H1 */}
      <h1
        className="
          font-display
          text-[3.5rem]
          sm:text-[3.5rem]
          md:text-[4rem]
          font-bold
          tracking-[-0.05em]
          leading-[0.95]
          text-white
          mb-7
          animate-fade-up
          text-center
        "
        
      >
        Votre réseau
        <span className="text-gradient">   immobilier </span>
          au Maroc.
      </h1>

      {/* Description */}
      <p
        className="
          text-white/70
          text-lg
          md:text-xl
          font-medium
          leading-relaxed
          mb-12
          max-w-2xl
          animate-fade-up
          text-center
        "
      >
        Publiez vos annonces, suivez vos performances et signez vos contrats —
        depuis un seul espace professionnel.
      </p>

      {/* Social proof */}
     <div className="flex flex-wrap justify-center gap-10 mt-4 animate-fade-up">
  {[
    { n: 1200, suffix: "+", l: "Annonces" },
    { n: 350, suffix: "+", l: "Agents actifs" },
    { n: 12, suffix: "", l: "Villes couvertes" },
    { n: 24, suffix: "h", l: "Activation" },
  ].map((s) => (
    <div key={s.l} className="text-center">
      <p className="font-display text-4xl text-white">
        <CountUp
          end={s.n}
          duration={7}
          separator=" "
          suffix={s.suffix}
        />
      </p>

      <p className="text-white/35 text-xs font-medium uppercase tracking-widest mt-1">
        {s.l}
      </p>
    </div>
  ))}
</div>
    </div>
  </div>

  {/* Scroll hint */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
    <ChevronDown className="w-5 h-5 text-white/25" />
  </div>
</section>
      {/* ══════════════════════ MARQUEE ══════════════════════ */}
    <div className="bg-ink border-y border-white/5 py-4 overflow-hidden relative">
  <div className="flex w-max animate-marquee gap-10">
    {[...BRANDS, ...BRANDS].map((b, i) => (
      <div
        key={i}
        className="flex items-center gap-3 flex-shrink-0"
      >
        <span className="w-1 h-1 rounded-full bg-teal/50" />

        <span className="text-white/25 text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">
          {b}
        </span>
      </div>
    ))}
  </div>
</div>
    {/* ══════════════════════ CATEGORIES S══════════════════════ */}
<section className="section relative bg-white overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/3 blur-[100px] rounded-full" />
    {/* Subtle dot grid */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#0f766e" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  </div>

  <div className="container relative z-10">
    {/* HEADER */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-teal/20 bg-teal/5">
        <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        <p className="text-teal text-xs font-bold tracking-[0.25em] uppercase">
          Explorer
        </p>
      </div>
      <h2 className="font-display text-5xl md:text-6xl tracking-[-0.06em] text-ink mb-6">
        Trouvez votre bien
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal to-teal/60">
          par catégorie
        </span>
      </h2>
      <p className="text-ink/50 text-lg max-w-2xl mx-auto leading-relaxed">
        Parcourez les types de biens disponibles et accédez rapidement
        à ce qui correspond à vos besoins.
      </p>
    </div>

    {/* GRID */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
      {PROP_TYPES.map((t, i) => (
        <Link
          key={t.val}
          to={`/properties?propertyType=${t.val}`}
          className="group relative rounded-2xl border border-ink/5 bg-white p-6 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:-translate-y-2 hover:border-teal/30 hover:shadow-[0_20px_60px_-10px_rgba(15,118,110,0.18)]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Top color bar */}
          <div className="absolute top-0 left-4 right-4 h-[2px] bg-teal rounded-b-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

          {/* Hover background glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* ICON */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Ring that expands on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-teal scale-90 opacity-0 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500" />
            {/* Icon bg */}
            <div className="w-14 h-14 rounded-xl bg-teal/6 flex items-center justify-center text-2xl group-hover:bg-teal/12 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-400 ease-out relative z-10">
              {t.icon}
            </div>
          </div>

          {/* TITLE */}
          <div className="relative z-10">
            <p className="font-display text-sm font-semibold tracking-[-0.02em] text-ink group-hover:text-teal transition-colors duration-300">
              {t.label}
            </p>
          </div>

          {/* ARROW — slides up from below */}
          <div className="relative z-10 flex items-center gap-1 text-teal text-xs font-semibold translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            Explorer
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
      {/* ══════════════════════ FEATURED PROPERTIES ══════════════════════ */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="eyebrow mb-3">Sélection</p>
              <h2 className="h-section">Annonces vedettes.</h2>
            </div>
            <Link to="/properties" className="btn-outline hidden sm:inline-flex">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-ink/6">
                  <div className="skeleton" style={{ aspectRatio: '16/10' }} />
                  <div className="bg-white p-4 space-y-3">
                    <div className="skeleton h-4 rounded-lg w-3/4" />
                    <div className="skeleton h-3 rounded-lg w-1/2" />
                    <div className="skeleton h-3 rounded-lg w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {props.map((p, i) => <PropertyCard key={p.id} p={p} delay={i * 70} />)}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties" className="btn-primary btn-lg">
              Voir toutes les annonces <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ MAP CTA ══════════════════════ */}
      <section className="section bg-pearl-warm">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-ink min-h-64">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=75"
              alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-dots opacity-60" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-10 md:p-16">
              <div className="text-center lg:text-left">
                <p className="text-teal text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-4 h-px bg-teal" /> Carte interactive
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                  Localisez le bien idéal<br />sur la carte.
                </h2>
                <p className="text-white/40 text-base max-w-md">Filtrez par ville, budget, type — visualisez chaque annonce géolocalisée.</p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/map" className="btn-teal btn-xl animate-glow">
                  <MapPin className="w-5 h-5" /> Ouvrir la carte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
 <section className="section relative overflow-hidden bg-white">

  {/* BACKGROUND */}
  <div className="absolute inset-0 overflow-hidden">

    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl" />

    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/10 rounded-full blur-3xl" />

    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:38px_38px]" />

  </div>

  <div className="container relative z-10">

    {/* TOP CONTENT */}
    <div className="max-w-5xl mx-auto text-center mb-24">

      {/* LABEL */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal/10 border border-teal/20 mb-7 backdrop-blur-sm">

        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />

        <span
          className="
            text-teal
            text-[11px]
            font-bold
            uppercase
            tracking-[0.22em]
          "
        >
          Pour les agents immobiliers
        </span>

      </div>

      {/* TITLE */}
      <h2
        className="
          font-display
          text-[3rem]
          sm:text-[4rem]
          md:text-[3.5rem]
          leading-[0.95]
          tracking-[-0.055em]
          text-ink
          mb-7
        "
      >
        Gérez votre activité

        <span className="block text-teal">
          avec une seule plateforme.
        </span>

      </h2>

      {/* DESCRIPTION */}
      <p
        className="
          max-w-2xl
          mx-auto
          text-lg
          md:text-xl
          text-ink/55
          leading-relaxed
          font-medium
        "
      >
        SAMSAR simplifie la gestion immobilière moderne :
        annonces, prospects, statistiques, contrats et communication —
        réunis dans une expérience claire et rapide.
      </p>

    </div>

    {/* MAIN */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-14 items-center">

      {/* FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="
              group
              relative
              bg-white
              rounded-[2rem]
              border
              border-ink/5
              p-8
              hover:border-teal/20
              hover:shadow-[0_20px_50px_rgba(20,184,166,0.08)]
              transition-all
              duration-300
            "
          >

            {/* ICON */}
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-teal/10
                flex
                items-center
                justify-center
                mb-7
                group-hover:scale-110
                transition-transform
              "
            >
              <f.icon className="w-6 h-6 text-teal" />
            </div>

            {/* NUMBER */}
            <div
              className="
                absolute
                top-5
                right-5
                font-display
                text-5xl
                tracking-[-0.05em]
                text-ink/[0.04]
              "
            >
              0{i + 1}
            </div>

            {/* TITLE */}
            <h3
              className="
                font-display
                text-[1.65rem]
                leading-[1]
                tracking-[-0.04em]
                text-ink
                mb-4
              "
            >
              {f.title}
            </h3>

            {/* DESC */}
            <p
              className="
                text-[15px]
                leading-relaxed
                text-ink/50
                font-medium
              "
            >
              {f.desc}
            </p>

          </div>
        ))}

      </div>

      {/* DASHBOARD */}
      <div className="relative">

        {/* GLOW */}
        <div className="absolute -inset-6 bg-teal/10 rounded-[3rem] blur-2xl" />

        {/* CARD */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.7rem]
            border
            border-ink/5
            bg-ink
            shadow-[0_30px_80px_rgba(15,23,42,0.18)]
          "
        >

          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-teal/15 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-teal" />
              </div>

              <div>

                <p
                  className="
                    font-display
                    text-2xl
                    tracking-[-0.04em]
                    text-white
                    leading-none
                  "
                >
                  SAMSAR Dashboard
                </p>

                <p className="text-white/35 text-sm mt-1 font-medium">
                  Karim Bennani · Casablanca
                </p>

              </div>

            </div>

            <div className="px-4 py-2 rounded-full bg-teal/15 border border-teal/20 flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />

              <span className="text-[11px] uppercase tracking-widest font-bold text-teal">
                Plan actif
              </span>

            </div>

          </div>

          {/* BODY */}
          <div className="p-8 space-y-8">

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">

              {[
                { l: 'Vues', v: '4 832' },
                { l: 'Contacts', v: '621' },
                { l: 'WhatsApp', v: '203' },
                { l: 'Annonces', v: '14' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white/5 rounded-2xl border border-white/5 p-5"
                >

                  <p
                    className="
                      font-display
                      text-4xl
                      tracking-[-0.05em]
                      text-white
                      leading-none
                      mb-3
                    "
                  >
                    {s.v}
                  </p>

                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-semibold">
                    {s.l}
                  </p>

                </div>
              ))}

            </div>

            {/* PERFORMANCE */}
            <div className="bg-white/5 rounded-[2rem] border border-white/5 p-6">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="font-display text-2xl tracking-[-0.04em] text-white">
                    Performance
                  </p>

                  <p className="text-sm text-white/35 mt-1 font-medium">
                    Activité des annonces
                  </p>

                </div>

                <span className="text-teal text-sm font-bold">
                  +28%
                </span>

              </div>

              {/* CHART */}
              <div className="flex items-end gap-3 h-40">

                {[30, 60, 40, 80, 70, 100, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-2xl bg-gradient-to-t from-teal to-teal/40"
                    style={{ height: `${h}%` }}
                  />
                ))}

              </div>

            </div>

            {/* PROPERTY LIST */}
            <div className="space-y-3">

              {[
                { t: 'Villa Marrakech', v: '892 vues', p: 88 },
                { t: 'Appartement Casablanca', v: '634 vues', p: 63 },
                { t: 'Riad Fès', v: '341 vues', p: 34 },
              ].map((item) => (
                <div
                  key={item.t}
                  className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4"
                >

                  <div className="w-14 h-14 rounded-2xl bg-white/10" />

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-3 mb-3">

                      <p className="text-white text-sm font-semibold truncate">
                        {item.t}
                      </p>

                      <span className="text-[11px] uppercase tracking-widest text-white/35 font-bold">
                        {item.v}
                      </span>

                    </div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${item.p}%` }}
                      />

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>

      </div>

    </div>

    {/* CTA */}
    <div className="flex flex-wrap justify-center gap-4 mt-20">

      <Link
        to="/agent/register"
        className="
          px-8
          py-4
          rounded-2xl
          bg-teal
          text-white
          font-semibold
          shadow-[0_15px_40px_rgba(20,184,166,0.25)]
          hover:scale-[1.02]
          transition-all
        "
      >
        Démarrer — 349 MAD/mois
      </Link>

      <Link
        to="/login"
        className="
          px-8
          py-4
          rounded-2xl
          border
          border-ink/10
          bg-white
          text-ink
          hover:border-teal/20
          hover:text-teal
          transition-all
        "
      >
        Se connecter
      </Link>

    </div>

  </div>
</section>

      {/* ══════════════════════ PRICING ══════════════════════ */}
    <section className="section relative overflow-hidden bg-white">

  {/* BACKGROUND */}
  <div className="absolute inset-0 overflow-hidden">

    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal/5 rounded-full blur-3xl animate-pulse" />

    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

  </div>

  <div className="container relative z-10">

    {/* HEADER */}
    <div className="max-w-4xl mx-auto text-center mb-20">

      {/* LABEL */}
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-5
          py-2
          rounded-full
          bg-teal/10
          border
          border-teal/20
          mb-7
          backdrop-blur-sm
          hover:scale-105
          transition-all
          duration-300
        "
      >

        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
        </span>

        <span
          className="
            text-[11px]
            uppercase
            tracking-[0.22em]
            font-bold
            text-teal
          "
        >
          Tarification simple
        </span>

      </div>

      {/* TITLE */}
      <h2
        className="
          font-display
          text-[2rem]
          sm:text-[1rem]
          md:text-[3rem]
          leading-[0.95]
          tracking-[-0.055em]
          text-ink
          mb-7
        "
      >
        Un seul abonnement.

        <span
          className="
            block
            text-teal
            hover:translate-x-1
            transition-transform
            duration-500
          "
        >
          Toutes les fonctionnalités.
        </span>

      </h2>

      {/* DESC */}
      <p
        className="
          max-w-2xl
          mx-auto
          text-lg
          md:text-xl
          text-ink/55
          leading-relaxed
          font-medium
        "
      >
        Pas de frais cachés, pas de commissions.
        Une formule claire pour gérer votre activité
        immobilière de manière professionnelle.
      </p>

    </div>

    {/* CARD */}
    <div className="max-w-6xl mx-auto">

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[2.8rem]
          border
          border-teal/15
          bg-white
          shadow-[0_30px_80px_rgba(15,23,42,0.08)]
          hover:shadow-[0_40px_120px_rgba(20,184,166,0.12)]
          transition-all
          duration-500
        "
      >

        {/* TOP LINE */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-cyan-400 to-teal" />

        {/* FLOATING GLOW */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-teal/10 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-700" />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT */}
          <div className="relative p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-ink/5">

            {/* POPULAR BADGE */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-teal/10
                border
                border-teal/20
                mb-8
                hover:scale-105
                transition-all
              "
            >

              <Sparkles className="w-4 h-4 text-teal animate-pulse" />

              <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-teal">
                Le plus populaire
              </span>

            </div>

            {/* PRICE */}
            <div className="mb-10">

              <div className="flex items-end gap-3 mb-3">

                <p
                  className="
                    font-display
                    text-[5rem]
                    leading-none
                    tracking-[-0.06em]
                    text-ink
                    group-hover:scale-[1.03]
                    transition-transform
                    duration-500
                  "
                >
                  349
                </p>

                <div className="pb-2">

                  <p className="text-2xl font-semibold text-ink/55">
                    MAD
                  </p>

                  <p className="text-sm text-ink/35">
                    par mois
                  </p>

                </div>

              </div>

              <p className="text-ink/50 leading-relaxed max-w-sm">
                Accès complet à toute la plateforme,
                sans engagement et avec activation rapide.
              </p>

            </div>

            {/* CTA */}
            <div className="space-y-4">

              <Link
                to="/agent/register"
                className="
                  group/btn
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                  px-8
                  py-5
                  rounded-2xl
                  bg-teal
                  text-white
                  font-semibold
                  shadow-[0_15px_40px_rgba(20,184,166,0.25)]
                  hover:scale-[1.02]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                <Rocket className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />

                Commencer maintenant

                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />

              </Link>

              <p className="text-center text-xs text-ink/35 leading-relaxed">
                Paiement CIH · Activation sous 24h
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="p-10 lg:p-14">

            <div className="mb-10">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-teal" />
                </div>

                <div>

                  <p
                    className="
                      font-display
                      text-3xl
                      tracking-[-0.04em]
                      text-ink
                    "
                  >
                    Tout est inclus.
                  </p>

                  <p className="text-ink/50 mt-1">
                    Fonctionnalités premium incluses
                  </p>

                </div>

              </div>

            </div>

            {/* FEATURES */}
            <div className="grid sm:grid-cols-2 gap-4">

              {[
                {
                  icon: LayoutDashboard,
                  text: 'Annonces illimitées'
                },
                {
                  icon: BarChart3,
                  text: 'Analytics en temps réel'
                },
                {
                  icon: FileText,
                  text: 'Contrats automatiques'
                },
                {
                  icon: Map,
                  text: 'Carte interactive'
                },
                {
                  icon: ImageIcon,
                  text: 'Upload HD sécurisé'
                },
                {
                  icon: MessageCircle,
                  text: 'Notifications WhatsApp'
                },
                {
                  icon: Headphones,
                  text: 'Support prioritaire'
                },
                {
                  icon: Zap,
                  text: 'Activation sous 24h'
                },
              ].map((f, i) => (
                <div
                  key={f.text}
                  className="
                    group/item
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    border
                    border-ink/5
                    bg-pearl/40
                    p-5
                    hover:border-teal/20
                    hover:bg-teal/[0.03]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                  style={{
                    animationDelay: `${i * 80}ms`
                  }}
                >

                  {/* ICON */}
                  <div
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-teal/10
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                      group-hover/item:scale-110
                      group-hover/item:rotate-3
                      transition-all
                    "
                  >

                    <f.icon className="w-5 h-5 text-teal" />

                  </div>

                  {/* TEXT */}
                  <div>

                    <p className="text-sm font-semibold text-ink leading-relaxed">
                      {f.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
    <section className="relative section overflow-hidden bg-ink">

  {/* BACKGROUND */}
  <div className="absolute inset-0 overflow-hidden">

    {/* GRID */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />

    {/* GLOW */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal/10 rounded-full blur-3xl" />

    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />

  </div>

  <div className="container relative z-10">

    {/* HEADER */}
    <div className="max-w-4xl mx-auto text-center mb-20">

      {/* LABEL */}
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-5
          py-2
          rounded-full
          bg-white/5
          border
          border-white/10
          backdrop-blur-sm
          mb-7
        "
      >

        <span className="relative flex h-2 w-2">

          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />

          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />

        </span>

        <span
          className="
            text-[11px]
            uppercase
            tracking-[0.22em]
            font-bold
            text-teal
          "
        >
          Témoignages clients
        </span>

      </div>

      {/* TITLE */}
      <h2
        className="
          font-display
          text-[3rem]
          sm:text-[4rem]
          md:text-[5.2rem]
          leading-[0.95]
          tracking-[-0.055em]
          text-white
          mb-7
        "
      >
        Ce que disent

        <span className="block text-teal">
          nos agents.
        </span>

      </h2>

      {/* RATING */}
      <div className="flex flex-col items-center gap-4">

        <div className="flex items-center gap-1">

          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="
                w-5
                h-5
                fill-amber-400
                text-amber-400
                hover:scale-110
                transition-transform
              "
            />
          ))}

        </div>

        <p className="text-white/40 text-sm font-medium">
          4.9 / 5 · Plus de 350 agents actifs
        </p>

      </div>

    </div>

    {/* TESTIMONIALS */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {TESTIMONIALS.map((t, i) => (

        <div
          key={i}
          className={`
            group
            relative
            overflow-hidden
            rounded-[2rem]
            border
            backdrop-blur-xl
            p-7
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_25px_80px_rgba(20,184,166,0.12)]
            ${
              i === activeTestimonial
                ? 'bg-white/[0.08] border-teal/30'
                : 'bg-white/[0.04] border-white/10'
            }
          `}
        >

          {/* TOP GLOW */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* QUOTE ICON */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-teal/10
              border
              border-teal/20
              flex
              items-center
              justify-center
              mb-6
              group-hover:scale-110
              transition-transform
            "
          >

            <Quote className="w-6 h-6 text-teal" />

          </div>

          {/* STARS */}
          <div className="flex items-center gap-1 mb-5">

            {Array(t.rating)
              .fill(0)
              .map((_, j) => (
                <Star
                  key={j}
                  className="
                    w-4
                    h-4
                    fill-amber-400
                    text-amber-400
                  "
                />
              ))}

          </div>

          {/* TEXT */}
          <p
            className="
              text-white/70
              text-[15px]
              leading-relaxed
              font-medium
              mb-8
            "
          >
            “{t.text}”
          </p>

          {/* USER */}
          <div className="flex items-center gap-4 pt-5 border-t border-white/10">

            {/* IMAGE */}
            <div className="relative">

              <img
                src={t.img}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  object-cover
                  border
                  border-white/10
                "
              />

              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal border-2 border-ink" />

            </div>

            {/* INFO */}
            <div className="flex-1">

              <p
                className="
                  text-white
                  font-semibold
                  text-sm
                "
              >
                {t.name}
              </p>

              <p
                className="
                  text-white/35
                  text-xs
                  uppercase
                  tracking-widest
                  mt-1
                "
              >
                {t.city}
              </p>

            </div>

            {/* VERIFIED */}
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white/5
                border
                border-white/10
                flex
                items-center
                justify-center
              "
            >

              <BadgeCheck className="w-5 h-5 text-teal" />

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>
</section>
      {/* ══════════════════════ FINAL CTA ══════════════════════ */}
    <section className="relative section overflow-hidden bg-white">

  {/* BACKGROUND */}
  <div className="absolute inset-0 overflow-hidden">

    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal/5 rounded-full blur-3xl" />

    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

  </div>

  <div className="container relative z-10">

    <div className="max-w-3xl mx-auto text-center">

      {/* LABEL */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal/10 border border-teal/20 mb-8">

        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />

        <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-teal">
          Démarrage rapide
        </span>

      </div>

      {/* TITLE */}
      <h2
        className="
          font-display
          text-[3rem]
          sm:text-[4rem]
          md:text-[3.5rem]
          leading-[0.95]
          tracking-[-0.055em]
          text-ink
          mb-7
        "
      >
        Rejoignez SAMSAR

        <span className="block text-teal">
          dès aujourd’hui.
        </span>

      </h2>

      {/* DESCRIPTION */}
      <p className="text-lg md:text-xl text-ink/55 leading-relaxed font-medium mb-12">
        349 MAD par mois · Activation sous 24h · Annulation à tout moment.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

        <Link
          to="/agent/register"
          className="
            group
            px-10
            py-5
            rounded-2xl
            bg-teal
            text-white
            font-semibold
            shadow-[0_15px_40px_rgba(20,184,166,0.25)]
            hover:scale-[1.03]
            hover:-translate-y-1
            transition-all
            duration-300
            flex
            items-center
            gap-3
          "
        >

          <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />

          Créer mon compte

          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

        </Link>

        <Link
          to="/properties"
          className="
            px-10
            py-5
            rounded-2xl
            border
            border-ink/10
            text-ink
            font-semibold
            bg-white
            hover:border-teal/20
            hover:text-teal
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >
          Parcourir les annonces
        </Link>

      </div>

      {/* MICRO TRUST */}
      <div className="mt-10 flex items-center justify-center gap-6 text-xs text-ink/40">

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal" />
          Paiement sécurisé
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal" />
          Activation 24h
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal" />
          Sans engagement
        </div>

      </div>

    </div>

  </div>
</section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="relative bg-ink overflow-hidden border-t border-white/10 py-20">

  {/* BACKGROUND */}
  <div className="absolute inset-0">

    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal/10 blur-3xl rounded-full" />

    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

  </div>

  <div className="container relative z-10">

    {/* TOP */}
    <div className="flex flex-col lg:flex-row justify-between gap-14 pb-14 border-b border-white/10">

      {/* BRAND */}
      <div className="max-w-sm">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-2xl bg-teal/15 border border-teal/20 flex items-center justify-center">

            <HomeIcon className="w-5 h-5 text-teal" />

          </div>

          <span className="font-display text-2xl tracking-[-0.04em] text-white">
            SAMSAR
          </span>

        </div>

        <p className="text-white/40 text-sm leading-relaxed">
          Plateforme SaaS moderne dédiée aux agents immobiliers au Maroc.
          Gestion, performance et visibilité en un seul endroit.
        </p>

      </div>

      {/* LINKS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">

        {/* NAV */}
        <div>

          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 mb-5">
            Navigation
          </p>

          <div className="space-y-3">

            {[
              { l: 'Annonces', p: '/properties', icon: LayoutDashboard },
              { l: 'Carte', p: '/map', icon: Map },
              { l: 'Connexion', p: '/login', icon: LogIn },
            ].map((lk) => (
              <Link
                key={lk.p}
                to={lk.p}
                className="
                  flex
                  items-center
                  gap-2
                  text-white/40
                  hover:text-teal
                  transition-all
                  group
                "
              >

                <lk.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />

                <span className="text-sm">
                  {lk.l}
                </span>

              </Link>
            ))}

          </div>

        </div>

        {/* AGENTS */}
        <div>

          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 mb-5">
            Agents
          </p>

          <div className="space-y-3">

            {[
              { l: 'Créer un compte', p: '/agent/register', icon: UserPlus },
              { l: 'Se connecter', p: '/login',icon: LogIn
                
                
               },
              { l: 'Dashboard', p: '/agent/dashboard', icon: BarChart3 },
            ].map((lk) => (
              <Link
                key={lk.p}
                to={lk.p}
                className="
                  flex
                  items-center
                  gap-2
                  text-white/40
                  hover:text-teal
                  transition-all
                  group
                "
              >

                <lk.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />

                <span className="text-sm">
                  {lk.l}
                </span>

              </Link>
            ))}

          </div>

        </div>

      </div>

    </div>

    {/* BOTTOM */}
    <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-5">

      <p className="text-white/30 text-xs font-medium">
        © ISMAIL ALAOUY 2026 SAMSAR — Tous droits réservés
      </p>

      <div className="flex items-center gap-4 text-white/25 text-xs">

        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal" />
          SaaS sécurisé
        </span>

        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal" />
          Performance optimisée
        </span>

        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal" />
          Maroc
        </span>

      </div>

    </div>

  </div>

</footer>
    </div>
  )
}
