import { useState, useEffect, useRef } from 'react'
import { api, formatDate } from '../../lib/api'
import { useAuth } from '../context/AuthContext'
import {
  Shield, Users, Home, TrendingUp, CheckCircle, XCircle, Bell,
  Clock, Search, MessageSquare, AlertTriangle, Zap, DollarSign,
  UserCheck, Activity, LayoutDashboard,LogOut,
  ChevronRight, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Building2, Eye, Filter, RefreshCw, Menu, X, User
} from 'lucide-react'
import { NotificationsMenu } from '../components/NotificationsMenu'
import { useLocation } from 'react-router'
import { Link } from 'react-router' 
type Tab = 'dashboard' | 'pending' | 'agents' | 'properties' | 'notify' | 'profile'

/* ─── STYLES ─── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f1923;
    --ink2: #162130;
    --teal: #0d9488;
    --teal2: #14b8a6;
    --teal3: #2dd4bf;
    --pearl: #f5f3f0;
    --white: #ffffff;
    --border: rgba(15,25,35,.08);
    --text2: rgba(15,25,35,.5);
    --text3: rgba(15,25,35,.32);
  }

  .adm-root {
    display: flex; height: 100vh; overflow: hidden;
    font-family: 'Outfit', sans-serif;
    background: var(--pearl);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 220px; min-width: 220px;
    background: var(--ink);
    display: flex; flex-direction: column;
    padding: 0;
    position: relative; z-index: 20;
    transition: width .25s ease;
  }
  .sidebar.collapsed { width: 64px; min-width: 64px; }

  .sb-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 18px 16px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  .sb-logo-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--teal);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sb-logo-text {
    font-weight: 800;
    font-size: 18px; color: #fff; letter-spacing: .02em;
    white-space: nowrap; overflow: hidden;
  }

  .sb-section-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: .15em; text-transform: uppercase;
    color: rgba(255,255,255,.2);
    padding: 16px 18px 6px;
    white-space: nowrap; overflow: hidden;
  }

  .sb-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 18px;
    border-radius: 10px; margin: 1px 8px;
    cursor: pointer;
    color: rgba(255,255,255,.45);
    font-size: 13px; font-weight: 500;
    transition: background .15s, color .15s;
    white-space: nowrap; overflow: hidden;
    position: relative;
  }
  .sb-item:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.8); }
  .sb-item.active {
    background: rgba(13,148,136,.18);
    color: var(--teal3);
  }
  .sb-item.active::before {
    content: '';
    position: absolute; left: -8px; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; border-radius: 0 3px 3px 0;
    background: var(--teal);
  }
  .sb-badge {
    margin-left: auto; min-width: 18px; height: 18px;
    background: #ef4444; color: #fff;
    border-radius: 99px; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px; flex-shrink: 0;
  }

  .sb-bottom {
    margin-top: auto;
    padding: 12px 8px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .sb-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background .15s;
    overflow: hidden;
  }
  .sb-user:hover { background: rgba(255,255,255,.06); }
  .sb-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--teal);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px; color: #fff; flex-shrink: 0;
  }
  .sb-user-info { overflow: hidden; }
  .sb-user-name { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-user-role { font-size: 10px; color: rgba(255,255,255,.3); white-space: nowrap; }

  /* ── MAIN AREA ── */
  .main {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    display: flex; flex-direction: column;
  }

  /* ── TOPBAR ── */
  .topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 0 24px;
    height: 60px; min-height: 60px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 10;
  }
  .topbar-title { font-size: 18px; font-weight: 700; color: var(--ink); flex: 1; }
  .topbar-sub { font-size: 12px; color: var(--text3); font-weight: 400; margin-top: 1px; }

  .search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--pearl); border: 1px solid var(--border);
    border-radius: 10px; padding: 0 12px;
    height: 36px; width: 200px;
  }
  .search-wrap input {
    border: none; background: transparent; outline: none;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    color: var(--ink); width: 100%;
  }
  .search-wrap input::placeholder { color: var(--text3); }

  .topbar-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid var(--border); background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text2);
    transition: all .15s; position: relative;
  }
  .topbar-btn:hover { border-color: var(--teal); color: var(--teal); }
  .notif-dot {
    position: absolute; top: 7px; right: 7px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #ef4444; border: 1.5px solid #fff;
  }

  .btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 36px;
    background: var(--ink); color: #fff;
    border: none; border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: all .15s;
  }
  .btn-primary:hover { background: var(--teal); }

  .btn-outline {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 36px;
    background: #fff; color: var(--ink);
    border: 1px solid var(--border); border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; white-space: nowrap;
    transition: all .15s;
  }
  .btn-outline:hover { border-color: var(--teal); color: var(--teal); }

  /* ── PAGE CONTENT ── */
  .page { padding: 20px 24px; flex: 1; }

  /* ── STAT CARDS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }

  .stat-card {
    background: var(--white); border-radius: 16px;
    border: 1px solid var(--border);
    padding: 18px 20px;
    cursor: default;
    transition: transform .2s, box-shadow .2s;
    animation: fadeUp .4s both;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,25,35,.07); }

  .stat-card.accent {
    background: var(--ink);
  }

  .stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .stat-trend {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 600;
    padding: 3px 7px; border-radius: 6px;
  }
  .trend-up { background: rgba(13,148,136,.1); color: var(--teal); }
  .trend-down { background: rgba(239,68,68,.08); color: #dc2626; }
  .trend-neutral { background: rgba(15,25,35,.06); color: var(--text2); }

  .stat-val {
    font-weight: 700;
    font-size: 28px; color: var(--ink);
    line-height: 1; margin-bottom: 4px;
    letter-spacing: -0.5px;
  }
  .stat-card.accent .stat-val { color: #fff; }
  .stat-label { font-size: 12px; color: var(--text3); font-weight: 500; }
  .stat-card.accent .stat-label { color: rgba(255,255,255,.4); }

  /* ── GRID LAYOUT ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .grid-3 { display: grid; grid-template-columns: 2fr 1.4fr 1.4fr; gap: 14px; margin-bottom: 20px; }
  .grid-b { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 14px; }

  /* ── CARDS ── */
  .card {
    background: var(--white); border-radius: 16px;
    border: 1px solid var(--border);
    overflow: hidden;
    animation: fadeUp .4s both;
  }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border);
  }
  .card-title { font-size: 14px; font-weight: 700; color: var(--ink); }
  .card-sub { font-size: 11px; color: var(--text3); margin-top: 1px; }
  .card-body { padding: 16px 20px; }

  .icon-btn {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid var(--border); background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text2);
    transition: all .15s;
  }
  .icon-btn:hover { border-color: var(--teal); color: var(--teal); }

  /* ── AGENT ROWS ── */
  .agent-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--border);
    transition: background .12s;
    cursor: default;
  }
  .agent-row:last-child { border-bottom: none; }
  .agent-row:hover { background: rgba(13,148,136,.03); }

  .av {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px; flex-shrink: 0;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 6px;
    font-size: 10px; font-weight: 700;
  }
  .badge-active { background: rgba(13,148,136,.1); color: var(--teal); }
  .badge-pending { background: rgba(245,158,11,.1); color: #d97706; }
  .badge-done { background: rgba(15,25,35,.06); color: var(--text2); }

  /* ── MINI ACTION BTNS ── */
  .act-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 7px;
    font-size: 11px; font-weight: 700;
    border: none; cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: all .15s;
  }
  .act-teal { background: var(--teal); color: #fff; }
  .act-teal:hover { background: #0f766e; }
  .act-wa { background: rgba(37,211,102,.12); color: #16a34a; }
  .act-wa:hover { background: rgba(37,211,102,.2); }
  .act-red { background: rgba(239,68,68,.08); color: #dc2626; }
  .act-red:hover { background: rgba(239,68,68,.14); }

  /* ── PROPERTY ROW ── */
  .prop-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 20px;
    border-bottom: 1px solid var(--border);
    transition: background .12s;
  }
  .prop-row:last-child { border-bottom: none; }
  .prop-row:hover { background: rgba(13,148,136,.03); }
  .prop-thumb { width: 36px; height: 28px; border-radius: 7px; object-fit: cover; flex-shrink: 0; }

  /* ── DONUT ── */
  .donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 8px 0; }

  /* ── NOTIFY FORM ── */
  .notif-form { display: flex; flex-direction: column; gap: 12px; }
  .form-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text3); margin-bottom: 4px; }
  .form-ctrl {
    width: 100%; padding: 9px 12px;
    border: 1px solid var(--border); border-radius: 10px;
    background: var(--pearl); font-family: 'Outfit', sans-serif;
    font-size: 13px; color: var(--ink); outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .form-ctrl:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,.1); }

  /* ── PENDING FULL VIEW ── */
  .pending-card {
    background: var(--white); border-radius: 14px;
    border: 1.5px solid var(--border);
    padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 10px;
    animation: slideRight .35s both;
    transition: border-color .2s, box-shadow .2s;
  }
  .pending-card:hover { border-color: rgba(13,148,136,.25); box-shadow: 0 6px 20px rgba(15,25,35,.06); }

  /* ── AGENTS TABLE ── */
  .agents-table { width: 100%; border-collapse: collapse; }
  .agents-table th {
    text-align: left; padding: 10px 14px;
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--text3);
    border-bottom: 1px solid var(--border);
    background: var(--pearl);
  }
  .agents-table td {
    padding: 12px 14px;
    font-size: 13px; color: var(--ink);
    border-bottom: 1px solid var(--border);
  }
  .agents-table tr:last-child td { border-bottom: none; }
  .agents-table tbody tr { transition: background .12s; }
  .agents-table tbody tr:hover { background: rgba(13,148,136,.03); }

  /* ── LOADING SKELETON ── */
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .skel {
    background: linear-gradient(90deg, #eeece8 25%, #e4e2de 50%, #eeece8 75%);
    background-size: 600px; border-radius: 10px;
    animation: shimmer 1.3s infinite linear;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(-10px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes pulseDot {
    0%,100% { transform:scale(1); opacity:1; }
    50%      { transform:scale(.75); opacity:.6; }
  }
  .pulse { animation: pulseDot 2s infinite; }

  /* delay helpers */
  .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
  .d5{animation-delay:.25s}.d6{animation-delay:.3s}.d7{animation-delay:.35s}

  .pending-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 14px;
    width: 100%;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: 1fr; }
    .grid-b { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: 1fr; }
    .topbar-title { display: none; }
    .topbar-sub { display: none; }
    .pending-grid { grid-template-columns: 1fr; }
  }

  /* ── SCROLLBAR ── */
  .main::-webkit-scrollbar { width: 5px; }
  .main::-webkit-scrollbar-track { background: transparent; }
  .main::-webkit-scrollbar-thumb { background: rgba(15,25,35,.12); border-radius: 10px; }
`

/* ─── AVATAR COLORS ─── */
const COLORS = [
  ['#e0f2f1','#0d9488'], ['#fef3c7','#d97706'], ['#ede9fe','#7c3aed'],
  ['#fee2e2','#dc2626'], ['#dbeafe','#2563eb'], ['#d1fae5','#059669'],
]
function getColor(name = '') { return COLORS[name.charCodeAt(0) % COLORS.length] }

function Avatar({ name, photo, size = 34 }: { name?: string; photo?: string; size?: number }) {
  const [bg, fg] = getColor(name)
  if (photo) return <img src={photo} style={{ width: size, height: size, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }}/>
  return (
    <div style={{ width: size, height: size, borderRadius: 9, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * .38, flexShrink: 0 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  )
}

/* ─── DONUT CHART (pure SVG) ─── */
function Donut({ pct, size = 100, color = '#0d9488' }: { pct: number; size?: number; color?: string }) {
  const r = size / 2 - 10
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(15,25,35,.06)" strokeWidth={10}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray .9s cubic-bezier(.22,1,.36,1)' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".38em"
       className="card-title"
        style={{ fontSize: size * .22, fill:'#0f1923', fontWeight: 400 }}>
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

/* ─── MINI BAR ─── */
function MiniBar({ val, max, color = '#0d9488' }: { val: number; max: number; color?: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(15,25,35,.06)', borderRadius: 99, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${(val / max) * 100}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .8s cubic-bezier(.22,1,.36,1)' }}/>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export function AdminPanel() {
  const { user, logout } = useAuth()
  const [tab, setTab]                   = useState<Tab>('dashboard')
  const [stats, setStats]               = useState<any>(null)
  const [agents, setAgents]             = useState<any[]>([])
  const [pendingAgents, setPendingAgents] = useState<any[]>([])
  const [properties, setProperties]     = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [collapsed, setCollapsed]       = useState(false)
  const [notifAgentId, setNotifAgentId] = useState('0')
  const [notifMsg, setNotifMsg]         = useState('')
  const [notifType, setNotifType]       = useState('info')
  const [notifSending, setNotifSending] = useState(false)
  const [notifSuccess, setNotifSuccess] = useState('')
  const [activating, setActivating]     = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled
  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, a, p] = await Promise.all([api.adminStats(), api.adminAgents(), api.adminProperties()])
      setStats(s); setAgents(a)
      setPendingAgents(a.filter((ag: any) => !ag.planActive))
      setProperties(p)
    } catch {}
    setLoading(false)
  }

  const handleActivate = async (id: number) => {
    setActivating(id)
    try { await api.activateAgent(id); await loadAll() } catch {}
    setActivating(null)
  }

  const handleDeactivate = async (id: number) => {
    if (!confirm('Suspendre cet agent ?')) return
    try { await api.deactivateAgent(id); await loadAll() } catch {}
  }

  const handleSendNotif = async (e: React.FormEvent) => {
    e.preventDefault(); setNotifSending(true); setNotifSuccess('')
    try {
      await api.sendNotification({ agentId: +notifAgentId, message: notifMsg, type: notifType })
      setNotifSuccess('Notification envoyée !'); setNotifMsg('')
    } catch {}
    setNotifSending(false)
  }

  const filtered = agents.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase())
  )

  const activePct = stats ? Math.round((stats.activeAgents / Math.max(stats.totalAgents, 1)) * 100) : 0

  /* Fake monthly data for bar chart */
  const monthlyBars = [
    { m: 'Jan', v: 3 }, { m: 'Fév', v: 5 }, { m: 'Mar', v: 8 },
    { m: 'Avr', v: 6 }, { m: 'Mai', v: 12 }, { m: 'Jun', v: 10 },
    { m: 'Jul', v: 15 }, { m: 'Aoû', v: 11 }, { m: 'Sep', v: 18 },
    { m: 'Oct', v: 22 }, { m: 'Nov', v: 19 }, { m: 'Déc', v: stats?.activeAgents ?? 24 },
  ]
  const barMax = Math.max(...monthlyBars.map(b => b.v))

  const NAV = [
    { id: 'dashboard' as Tab, label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'pending'   as Tab, label: 'En attente',   icon: Clock,           badge: pendingAgents.length },
    { id: 'agents'    as Tab, label: 'Agents',        icon: Users },
    { id: 'properties'as Tab, label: 'Annonces',      icon: Home },
    { id: 'notify'    as Tab, label: 'Notifications', icon: Bell },
  ]

  const PAGE_TITLES: Record<Tab, { title: string; sub: string }> = {
    dashboard:  { title: 'Dashboard',     sub: 'Vue globale de la admin' },
    pending:    { title: 'En attente',    sub: 'Agents en attente d\'activation' },
    agents:     { title: 'Agents',         sub: 'Gérer tous les comptes agents' },
    properties: { title: 'Annonces',       sub: 'Toutes les annonces publiées' },
    notify:     { title: 'Notifications',  sub: 'Envoyer des messages aux agents' },
    profile:    { title: 'Mon Profil',     sub: 'Gérer vos informations' },
  }

  return (
    <>
      <style>{S}</style>
      <div className="adm-root">

        {/* ══ SIDEBAR ══ */}
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <Shield size={16} color="#fff" strokeWidth={2.5}/>
            </div>
            {!collapsed && <span className="card-title" style={{color:"white"}}>SAMSAR</span>}
          </div>
          

          {!collapsed && <div className="sb-section-label">Menu</div>}

          {NAV.map(n => (
            <div key={n.id} className={`sb-item ${tab === n.id ? 'active' : ''}`}
              onClick={() => setTab(n.id)} title={collapsed ? n.label : undefined}>
              <n.icon size={16} strokeWidth={2}/>
              {!collapsed && <span>{n.label}</span>}
              {!collapsed && n.badge && n.badge > 0
                ? <span className="sb-badge">{n.badge}</span>
                : null}
            </div>
          ))}

          {!collapsed && <div className="sb-section-label" style={{ marginTop: 8 }}>Général</div>}
         

      
          <div className="sb-item" onClick={logout} title={collapsed ? 'Déconnexion' : undefined}>
            <LogOut size={16} strokeWidth={2}/>
            {!collapsed && <span>Déconnexion</span>}
          </div>

          <div className="sb-bottom">
            <div className="sb-user" onClick={() => setTab('profile')}>
              <Avatar name={user?.name || 'A'} size={32}/>
              {!collapsed && (
                <div className="sb-user-info">
                  <div className="sb-user-name">{user?.name || 'Admin SAMSAR'}</div>
                  <div className="sb-user-role">Administrateur</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <div className="main">

          {/* ── TOPBAR ── */}
          <div className="topbar">
            <button className="icon-btn" onClick={() => setCollapsed(!collapsed)}>
              <Menu size={15}/>
            </button>

            <div style={{ flex: 1, marginLeft: 4 }}>
              <div className="topbar-title">{PAGE_TITLES[tab].title}</div>
              <div className="topbar-sub">{PAGE_TITLES[tab].sub}</div>
            </div>

            {/* search */}
            {/* <div className="search-wrap">
              <Search size={13} color="rgba(15,25,35,.3)"/>
              <input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div> */}

            {/* notif */}
            {/* <div className="topbar-btn" style={{ position: 'relative' }}>
              <Bell size={15}/>
              {pendingAgents.length > 0 && <span className="notif-dot"/>}
            </div> */}
            
              <NotificationsMenu transparent={transparent} />
            {/* refresh */}
            <div className="topbar-btn" onClick={loadAll} title="Actualiser">
              <RefreshCw size={14}/>
            </div>

            {/* add agent btn */}
            <button className="btn-outline" style={{ padding: '0 8px', borderRadius: 999 }} onClick={() => setTab('profile')}>
              <Avatar name={user?.name || 'A'} size={24}/>
              <span style={{ marginLeft: 6, fontWeight: 600 }}>Profil</span>
            </button>
          </div>

          {/* ══ PAGE CONTENT ══ */}
          <div className="page">

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height: 110 }}/>)}
                </div>
                {[1,2,3].map(i => <div key={i} className="skel" style={{ height: 80 }}/>)}
              </div>
            ) : (

              <>
                {/* ══════ DASHBOARD TAB ══════ */}
                {tab === 'dashboard' && (
                  <>
                    {/* STAT CARDS */}
                    <div className="stats-row">
                      {[
                        { label: 'Total agents',  val: stats?.totalAgents ?? 0,   icon: Users,       bg: 'rgba(15,25,35,.07)', ic: '#0f1923', trend: '+12%', up: true,  cls: 'd1' },
                        { label: 'Agents actifs', val: stats?.activeAgents ?? 0,   icon: UserCheck,   bg: 'rgba(13,148,136,.1)', ic: '#0d9488', trend: '+8%',  up: true,  cls: 'd2' },
                        { label: 'En attente',    val: stats?.pendingAgents ?? 0,  icon: Clock,       bg: 'rgba(245,158,11,.1)', ic: '#d97706', trend: pendingAgents.length > 0 ? '!': '—', up: false, cls: 'd3' },
                        { label: 'Revenu / mois', val: `${(stats?.monthlyRevenue ?? 0).toLocaleString()} MAD`, icon: DollarSign, bg: 'rgba(5,150,105,.1)', ic: '#059669', trend: '+5%', up: true, cls: 'd4', accent: true },
                      ].map(s => (
                        <div key={s.label} className={`stat-card ${s.accent ? 'accent' : ''} ${s.cls}`}>
                          <div className="stat-top">
                            <div className="stat-icon" style={{ background: s.accent ? 'rgba(255,255,255,.1)' : s.bg }}>
                              <s.icon size={18} color={s.accent ? '#2dd4bf' : s.ic} strokeWidth={2}/>
                            </div>
                            <span className={`stat-trend ${s.up ? 'trend-up' : s.trend === '!' ? 'trend-down' : 'trend-neutral'}`}
                              style={s.accent ? { background: 'rgba(255,255,255,.12)', color: '#2dd4bf' } : undefined}>
                              {s.up ? <ArrowUpRight size={11}/> : s.trend === '!' ? <ArrowDownRight size={11}/> : null}
                              {s.trend}
                            </span>
                          </div>
                          <div className="card-title" style={{fontSize:25}}>{s.val}</div>
                          <div className="stat-label">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* ROW 2: Analytics + Pending + Properties */}
                    <div className="grid-3">

                      {/* BAR CHART — Agents par mois */}
                      <div className="card d5">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Inscriptions mensuelles</div>
                            <div className="card-sub">Nouveaux agents · 12 derniers mois</div>
                          </div>
                          <button className="icon-btn"><MoreHorizontal size={13}/></button>
                        </div>
                        <div className="card-body">
                          {/* bar chart */}
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100, marginBottom: 8 }}>
                            {monthlyBars.map((b, i) => (
                              <div key={b.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                                <div style={{
                                  width: '100%',
                                  height: `${(b.v / barMax) * 100}%`,
                                  borderRadius: 5,
                                  background: i === monthlyBars.length - 1 ? 'var(--teal)' : i >= monthlyBars.length - 3 ? 'rgba(13,148,136,.4)' : 'rgba(15,25,35,.08)',
                                  transition: `height .6s ${i * .04}s cubic-bezier(.22,1,.36,1)`,
                                  cursor: 'default',
                                  position: 'relative',
                                }}/>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {monthlyBars.map((b, i) => (
                              <div key={b.m} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--text3)', fontWeight: 600 }}>
                                {i % 3 === 0 ? b.m : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PENDING MINI */}
                      <div className="card d6">
                        <div className="card-header">
                          <div>
                            <div className="card-title">En attente</div>
                            <div className="card-sub">{pendingAgents.length} à activer</div>
                          </div>
                          {pendingAgents.length > 0 && (
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} className="pulse"/>
                          )}
                        </div>
                        <div style={{ padding: 0 }}>
                          {pendingAgents.length === 0 ? (
                            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                              <CheckCircle size={28} color="rgba(13,148,136,.3)" style={{ margin: '0 auto 8px' }}/>
                              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Tous traités ✓</div>
                            </div>
                          ) : (
                            pendingAgents.slice(0, 4).map(a => (
                              <div key={a.id} className="agent-row">
                                <Avatar name={a.name} photo={a.photo} size={30}/>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{a.city || a.email}</div>
                                </div>
                                <button className="act-btn act-teal" onClick={() => handleActivate(a.id)} disabled={activating === a.id}>
                                  {activating === a.id
                                    ? <span style={{ width: 10, height: 10, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}/>
                                    : <><Zap size={9}/> Activer</>}
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                        {pendingAgents.length > 4 && (
                          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)' }}>
                            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', height: 30, fontSize: 12 }}
                              onClick={() => setTab('pending')}>
                              Voir tous ({pendingAgents.length}) <ChevronRight size={12}/>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ACTIVATION RATE */}
                      <div className="card d7">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Taux d'activation</div>
                            <div className="card-sub">Agents actifs / total</div>
                          </div>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                          <Donut pct={activePct} size={110}/>
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                              { label: 'Actifs',     val: stats?.activeAgents ?? 0,  color: '#0d9488' },
                              { label: 'En attente', val: stats?.pendingAgents ?? 0, color: '#f59e0b' },
                              { label: 'Total',      val: stats?.totalAgents ?? 0,   color: 'rgba(15,25,35,.15)' },
                            ].map(r => (
                              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color, flexShrink: 0 }}/>
                                <span style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{r.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{r.val}</span>
                                <MiniBar  val={r.val} max={stats?.totalAgents ?? 1} color={r.color}/>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROW 3: All agents table + recent properties + revenue */}
                    <div className="grid-b">
                      {/* Recent agents */}
                      <div className="card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Collaboration agents</div>
                            <div className="card-sub">{agents.length} agents inscrits</div>
                          </div>
                          <button className="btn-outline" style={{ height: 28, fontSize: 11, padding: '0 10px' }}
                            onClick={() => setTab('agents')}>
                            Voir tout <ArrowUpRight size={11}/>
                          </button>
                        </div>
                        <div>
                          {agents.slice(0, 5).map(a => (
                            <div key={a.id} className="agent-row">
                              <Avatar name={a.name} photo={a.photo} size={32}/>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</div>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <span className={`badge ${a.planActive ? 'badge-active' : 'badge-pending'}`}>
                                  {a.planActive ? '● Actif' : '⏳ En attente'}
                                </span>
                                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{a.propertyCount || 0} ann.</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Properties */}
                      <div className="card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Annonces récentes</div>
                            <div className="card-sub">{properties.length} au total</div>
                          </div>
                          <button className="icon-btn" onClick={() => setTab('properties')}>
                            <ArrowUpRight size={13}/>
                          </button>
                        </div>
                        <div>
                          {properties.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="prop-row">
                              <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=60'}
                                className="prop-thumb" alt=""/>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{p.city}</div>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{p.price?.toLocaleString()}</div>
                                <div style={{ fontSize: 9, color: 'var(--text3)' }}>MAD</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Revenue card */}
                      <div className="card" style={{ background: 'var(--ink)', border: 'none' }}>
                        <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                          <div>
                            <div className="card-title" style={{ color: '#fff' }}>Revenu mensuel</div>
                            <div className="card-sub" style={{ color: 'rgba(255,255,255,.3)' }}>Récurrent · 349 MAD/agent</div>
                          </div>
                          <TrendingUp size={16} color="#2dd4bf"/>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 32, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
                              {(stats?.monthlyRevenue ?? 0).toLocaleString()}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>MAD ce mois</div>
                          </div>
                          {[
                            { l: 'Trimestre', v: (stats?.monthlyRevenue ?? 0) * 3 },
                            { l: 'Semestre',  v: (stats?.monthlyRevenue ?? 0) * 6 },
                            { l: 'Année',     v: (stats?.monthlyRevenue ?? 0) * 12 },
                          ].map(r => (
                            <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>{r.l}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#2dd4bf' }}>{r.v.toLocaleString()} MAD</span>
                            </div>
                          ))}
                          <div style={{ marginTop: 4, padding: '12px 14px', background: 'rgba(255,255,255,.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,.08)' }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Taux de rétention estimé</div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ width: `${activePct}%`, height: '100%', background: 'linear-gradient(90deg,#0d9488,#2dd4bf)', borderRadius: 99, transition: 'width .8s ease' }}/>
                            </div>
                            <div style={{ fontSize: 11, color: '#2dd4bf', marginTop: 5, fontWeight: 700 }}>{activePct}% actifs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ══════ PENDING TAB ══════ modifer this */}
                {tab === 'pending' && (
                  <div style={{  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{pendingAgents.length}</span> agent{pendingAgents.length !== 1 ? 's' : ''} en attente de validation
                      </div>
                      <button className="btn-outline" onClick={loadAll}><RefreshCw size={12}/> Actualiser</button>
                    </div>

                    {pendingAgents.length === 0 ? (
                      <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <CheckCircle size={40} color="rgba(13,148,136,.3)" style={{ margin: '0 auto 12px' }}/>
                        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 6, letterSpacing: '-0.5px' }}>Tout est traité ✓</div>
                        <div style={{ fontSize: 13, color: 'var(--text3)' }}>Aucun agent en attente d'activation.</div>
                      </div>
                    ) : (
                      <div className="pending-grid">
                        {pendingAgents.map((a, i) => {
                          const waMsg = encodeURIComponent(`Bonjour ${a.name}, votre compte SAMSAR est activé ! Connectez-vous sur samsar.ma 🎉`)
                          const waLink = a.phone ? `https://wa.me/${a.phone.replace(/[^\d]/g,'')}?text=${waMsg}` : null
                          return (
                            <div key={a.id} className="pending-card" style={{ animationDelay: `${i * .07}s`, margin: 0, flexDirection: 'column', alignItems: 'flex-start'}}>
                              <Link to={`/agent-profile/${a.id}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
                                <Avatar name={a.name} photo={a.photo} size={44}/>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{a.name}</span>
                                    <span className="badge badge-pending">⏳ En attente</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{a.email}</div>
                                </div>
                              </Link>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                                {a.city  && <span style={{ fontSize: 11, background: 'rgba(15,25,35,.05)', color: 'var(--text2)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>📍 {a.city}</span>}
                                {a.phone && <span style={{ fontSize: 11, background: 'rgba(15,25,35,.05)', color: 'var(--text2)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>📱 {a.phone}</span>}
                                <span style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Inscrit le {formatDate(a.createdAt)}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 6, width: '100%', marginTop: 12 }}>
                                {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" className="act-btn act-wa" style={{ flex: 1, justifyContent: 'center' }}><MessageSquare size={12}/> WhatsApp</a>}
                                <button className="act-btn act-teal" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleActivate(a.id)} disabled={activating === a.id}>
                                  {activating === a.id
                                    ? <span style={{ width: 11, height: 11, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}/>
                                    : <><Zap size={12}/> Activer +30j</>}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ══════ AGENTS TAB ══════ */}
                {tab === 'agents' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                        <Search size={13} color="rgba(15,25,35,.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                        <input value={search} onChange={e => setSearch(e.target.value)}
                          placeholder="Nom, email, ville…"
                          style={{ width: '100%', height: 38, paddingLeft: 32, paddingRight: 12, border: '1px solid var(--border)', borderRadius: 10, background: '#fff', fontFamily: 'Outfit,sans-serif', fontSize: 13, color: 'var(--ink)', outline: 'none' }}/>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text3)' }}><b style={{ color: 'var(--ink)' }}>{filtered.length}</b> agents</span>
                    </div>

                    <div className="card">
                      <div style={{ overflowX: 'auto' }}>
                        <table className="agents-table">
                          <thead>
                            <tr>
                              <th>Agent</th>
                              <th style={{ display: window.innerWidth < 768 ? 'none' : undefined }}>Email</th>
                              <th>Ville</th>
                              <th>Statut</th>
                              <th>Annonces</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((a, i) => (
                              <tr key={a.id} style={{ animationDelay: `${i * .04}s`, animation: 'fadeUp .3s both' }}>
                                <td>
                                  <Link to={`/agent-profile/${a.id}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none' }} className="hover:opacity-80 transition-opacity">
                                    <Avatar name={a.name} photo={a.photo} size={32}/>
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{a.name}</div>
                                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>ID #{a.id}</div>
                                    </div>
                                  </Link>
                                </td>
                                <td style={{ color: 'var(--text2)', fontSize: 12 }}>{a.email}</td>
                                <td style={{ color: 'var(--text2)', fontSize: 12 }}>{a.city || '—'}</td>
                                <td>
                                  <span className={`badge ${a.planActive ? 'badge-active' : 'badge-pending'}`}>
                                    {a.planActive ? '● Actif' : '⏳ Attente'}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 700, color: 'var(--ink)' }}>{a.propertyCount || 0}</td>
                                <td>
                                  {!a.planActive
                                    ? <button className="act-btn act-teal" onClick={() => handleActivate(a.id)}><Zap size={10}/> Activer</button>
                                    : <button className="act-btn act-red" onClick={() => handleDeactivate(a.id)}><XCircle size={10}/> Suspendre</button>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════ PROPERTIES TAB ══════ */}
                {tab === 'properties' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: 'var(--text2)' }}><b style={{ color: 'var(--ink)' }}>{properties.length}</b> annonces au total</span>
                      <span className="badge badge-active">● {properties.filter((p:any) => p.status === 'AVAILABLE').length} actives</span>
                    </div>
                    <div className="card">
                      <div style={{ overflowX: 'auto' }}>
                        <table className="agents-table">
                          <thead><tr>
                            <th>Annonce</th><th>Ville</th><th>Prix</th><th>Statut</th><th>Date</th>
                          </tr></thead>
                          <tbody>
                            {properties.map((p: any, i) => (
                              <tr key={p.id} style={{ animationDelay: `${i * .04}s`, animation: 'fadeUp .3s both' }}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=60'}
                                      style={{ width: 40, height: 30, borderRadius: 7, objectFit: 'cover' }} alt=""/>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</span>
                                  </div>
                                </td>
                                <td style={{ color: 'var(--text2)', fontSize: 12 }}>{p.city}</td>
                                <td><span style={{ fontWeight: 700, color: 'var(--teal)' }}>{p.price?.toLocaleString()}</span> <span style={{ fontSize: 10, color: 'var(--text3)' }}>MAD</span></td>
                                <td>
                                  <span className={`badge ${p.status === 'AVAILABLE' ? 'badge-active' : 'badge-done'}`}>
                                    {p.status === 'AVAILABLE' ? '● Actif' : 'Inactif'}
                                  </span>
                                </td>
                                <td style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDate(p.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════ NOTIFY TAB ══════ */}
                {tab === 'notify' && (
                  <div className="grid-2">
                    <div className="card">
                      <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(13,148,136,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={16} color="var(--teal)"/>
                          </div>
                          <div>
                            <div className="card-title">Envoyer une notification</div>
                            <div className="card-sub">Message vers un ou tous les agents</div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSendNotif} className="notif-form">
                          {notifSuccess && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,.08)', border: '1px solid rgba(13,148,136,.2)', borderRadius: 10, padding: '10px 14px' }}>
                              <CheckCircle size={14} color="var(--teal)"/>
                              <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{notifSuccess}</span>
                            </div>
                          )}
                          <div>
                            <div className="form-label">Destinataire</div>
                            <select value={notifAgentId} onChange={e => setNotifAgentId(e.target.value)} className="form-ctrl" style={{ height: 40, appearance: 'none' }}>
                              <option value="0">📢 Tous les agents ({agents.length})</option>
                              {agents.map(a => <option key={a.id} value={a.id}>{a.name} — {a.email}</option>)}
                            </select>
                          </div>
                          <div>
                            <div className="form-label">Type</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                              {[{v:'info',e:'ℹ️',l:'Info'},{v:'success',e:'✅',l:'Succès'},{v:'warning',e:'⚠️',l:'Alerte'},{v:'error',e:'❌',l:'Erreur'}].map(t => (
                                <button key={t.v} type="button" onClick={() => setNotifType(t.v)}
                                  style={{ padding: '8px 4px', border: `1.5px solid ${notifType === t.v ? 'var(--teal)' : 'var(--border)'}`, background: notifType === t.v ? 'rgba(13,148,136,.08)' : 'var(--pearl)', borderRadius: 10, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: notifType === t.v ? 'var(--teal)' : 'var(--text2)', fontFamily: 'Outfit,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all .2s' }}>
                                  <span style={{ fontSize: 16 }}>{t.e}</span>{t.l}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="form-label">Message</div>
                            <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} required
                              className="form-ctrl" rows={5} placeholder="Votre message pour les agents…"/>
                          </div>
                          <button type="submit" disabled={notifSending} className="btn-primary" style={{ justifyContent: 'center', height: 44, borderRadius: 12, opacity: notifSending ? .7 : 1 }}>
                            {notifSending
                              ? <span style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}/>
                              : <><Bell size={14}/> Envoyer la notification</>}
                          </button>
                        </form>
                      </div>
                    </div>
                    {/* Preview Notif */}
                    <div className="card" style={{ background: 'var(--pearl)' }}>
                      <div className="card-header">
                        <div className="card-title">Aperçu de la notification</div>
                      </div>
                      <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                        <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 10px 30px rgba(15,25,35,.07)', border: '1px solid var(--border)' }}>
                           <div style={{ display: 'flex', gap: 12 }}>
                             <div style={{ width: 40, height: 40, borderRadius: '50%', background: notifType === 'info' ? '#e0f2fe' : notifType === 'success' ? '#dcfce7' : notifType === 'warning' ? '#fef3c7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                               <span style={{ fontSize: 18 }}>{notifType === 'info' ? 'ℹ️' : notifType === 'success' ? '✅' : notifType === 'warning' ? '⚠️' : '❌'}</span>
                             </div>
                             <div>
                               <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Nouvelle notification</div>
                               <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                                 {notifMsg || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Le contenu de votre message apparaîtra ici...</span>}
                               </div>
                               <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>À l'instant</div>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            
                {/* ══════ PROFILE TAB ══════ */}
                {tab === 'profile' && (
                  <div style={{  }}>
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title">Mon Profil ({user?.name || 'Admin'})</div>
                      </div>
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <Avatar name={user?.name || 'Admin'} size={80} />
                          <div>
                            <button className="btn-outline">Changer la photo</button>
                          </div>
                        </div>
                        <div className="notif-form">
                          <div className="grid-2">
                            <div>
                              <div className="form-label">Nom complet</div>
                              <input className="form-ctrl" defaultValue={user?.name || ''} />
                            </div>
                            <div>
                              <div className="form-label">Rôle</div>
                              <input className="form-ctrl" defaultValue="Administrateur" readOnly style={{ background: 'var(--pearl)', color: 'var(--text2)' }} />
                            </div>
                          </div>
                          <div>
                            <div className="form-label">Email</div>
                            <input className="form-ctrl" defaultValue={user?.email || ''} type="email" />
                          </div>
                          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }}/>
                          <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Mettre à jour mon profil</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}