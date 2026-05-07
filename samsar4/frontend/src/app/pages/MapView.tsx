import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Navbar } from '../components/Navbar'
import { api, formatPrice } from '../../lib/api'
import { MapPin, SlidersHorizontal, X, ChevronRight, Search, Home } from 'lucide-react'

const CITIES = ['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Fès', 'Agadir']

const mkIcon = (type: string, featured: boolean) =>
  L.divIcon({
    html: `
      <div style="
        position:relative;
        display:inline-flex;
        flex-direction:column;
        align-items:center;
        transform:translateX(-50%);
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
      ">
        <div style="
          background:${featured ? '#00C896' : type === 'SALE' ? '#0A0F1E' : '#374151'};
          color:white;
          padding:5px 12px;
          border-radius:24px;
          font-size:11px;
          font-family:Plus Jakarta Sans,sans-serif;
          font-weight:800;
          white-space:nowrap;
          border:2px solid rgba(255,255,255,0.25);
          letter-spacing:0.06em;
          backdrop-filter:blur(8px);
        ">${type === 'SALE' ? 'Vente' : 'Loc.'}</div>
        <div style="
          width:6px;height:6px;
          background:${featured ? '#00C896' : type === 'SALE' ? '#0A0F1E' : '#374151'};
          transform:rotate(45deg);
          margin-top:-3px;
          border-right:2px solid rgba(255,255,255,0.25);
          border-bottom:2px solid rgba(255,255,255,0.25);
        "/>
      </div>`,
    className: '',
    iconAnchor: [0, 0],
  })

export function MapView() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [propType, setPropType] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setSidebarVisible(false)
    const q = new URLSearchParams()
    if (city) q.set('city', city)
    if (type) q.set('type', type)
    if (propType) q.set('propertyType', propType)
    q.set('limit', '100')
    api.getProperties(q.toString())
      .then(r => {
        setProperties((r.data || []).filter((p: any) => p.lat && p.lng))
        setTimeout(() => setSidebarVisible(true), 100)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, type, propType])

  const center: [number, number] =
    properties.length > 0 ? [properties[0].lat, properties[0].lng] : [31.7917, -7.0926]

  const hasFilters = city || type || propType
  const resetFilters = () => { setCity(''); setType(''); setPropType('') }

  return (
    <div className="min-h-screen flex flex-col bg-pearl-warm">
      <Navbar />

      <div className="pt-16 flex flex-col" style={{ height: '100vh' }}>

        {/* ── TOPBAR ── */}
        <div
          className="relative flex-shrink-0 px-4 py-3 flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(10,15,30,0.07)',
            boxShadow: '0 1px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Brand mark */}
          <div
            className="flex items-center gap-2.5 flex-shrink-0"
            style={{ borderRight: '1px solid rgba(10,15,30,0.08)', paddingRight: '16px', marginRight: '4px' }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#0A0F1E' }}
            >
              <MapPin className="w-4 h-4" style={{ color: '#00C896' }} />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-ink text-sm leading-none">Carte</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(10,15,30,0.35)' }}>
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-teal animate-pulse" />
                    Chargement…
                  </span>
                ) : (
                  `${properties.length} bien${properties.length !== 1 ? 's' : ''}`
                )}
              </p>
            </div>
          </div>

          {/* City pills — scrollable */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none min-w-0">
            {CITIES.map(c => (
              <button
                key={c}
                onClick={() => setCity(city === c ? '' : c)}
                className="flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 whitespace-nowrap"
                style={{
                  background: city === c ? '#0A0F1E' : 'rgba(10,15,30,0.05)',
                  color: city === c ? 'white' : 'rgba(10,15,30,0.5)',
                  transform: city === c ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: city === c ? '0 4px 12px rgba(10,15,30,0.18)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300"
              style={{
                background: showFilter ? '#0A0F1E' : 'rgba(10,15,30,0.06)',
                color: showFilter ? 'white' : 'rgba(10,15,30,0.55)',
                boxShadow: showFilter ? '0 4px 12px rgba(10,15,30,0.2)' : 'none',
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filtres</span>
              {hasFilters && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00C896' }}
                />
              )}
            </button>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* ── FILTER PANEL ── */}
        <div
          className="flex-shrink-0 overflow-hidden transition-all duration-500"
          style={{
            maxHeight: showFilter ? '120px' : '0px',
            opacity: showFilter ? 1 : 0,
          }}
        >
          <div
            className="px-5 py-4 flex flex-wrap gap-5"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(10,15,30,0.06)',
            }}
          >
            {[
              { label: 'Ville', val: city, set: setCity, opts: [{ v: '', l: 'Toutes les villes' }, ...CITIES.map(c => ({ v: c, l: c }))] },
              { label: 'Transaction', val: type, set: setType, opts: [{ v: '', l: 'Tout type' }, { v: 'SALE', l: 'Vente' }, { v: 'RENT', l: 'Location' }] },
              { label: 'Catégorie', val: propType, set: setPropType, opts: [{ v: '', l: 'Tous' }, { v: 'apartment', l: 'Appartement' }, { v: 'villa', l: 'Villa' }, { v: 'riad', l: 'Riad' }] },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(10,15,30,0.35)', letterSpacing: '0.12em' }}
                >
                  {f.label}
                </label>
                <select
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  className="field py-2 text-sm font-medium"
                  style={{ minWidth: '160px', borderRadius: '12px' }}
                >
                  {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY: sidebar + map ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── SIDEBAR ── */}
          <div
            className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden transition-all duration-500"
            style={{
              width: properties.length > 0 ? '300px' : '0px',
              opacity: properties.length > 0 ? 1 : 0,
              background: '#0A0F1E',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Sidebar header */}
            <div
              className="px-5 py-4 flex-shrink-0 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <p className="text-white font-bold text-sm">{properties.length} résultats</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {city || 'Tout le Maroc'}
                </p>
              </div>
              <div
                className="px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(0,200,150,0.15)', color: '#00C896' }}
              >
                {type === 'SALE' ? 'Vente' : type === 'RENT' ? 'Location' : 'Tout'}
              </div>
            </div>

            {/* Property list */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {properties.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/property/${p.id}`}
                  onMouseEnter={() => setActiveId(p.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className="flex gap-3 p-4 group relative transition-all duration-300"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: activeId === p.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                    opacity: sidebarVisible ? 1 : 0,
                    transform: sidebarVisible ? 'translateX(0)' : 'translateX(-16px)',
                    transition: `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms, background 0.2s`,
                  }}
                >
                  {/* Active indicator */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full transition-all duration-300"
                    style={{
                      background: '#00C896',
                      opacity: activeId === p.id ? 1 : 0,
                      transform: activeId === p.id ? 'scaleY(1)' : 'scaleY(0)',
                    }}
                  />

                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&q=60'}
                      className="w-14 h-14 rounded-xl object-cover"
                      style={{
                        filter: activeId === p.id ? 'brightness(1.1)' : 'brightness(0.85)',
                        transition: 'filter 0.3s',
                      }}
                    />
                    {p.isFeatured && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ background: '#00C896', border: '2px solid #0A0F1E' }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-xs line-clamp-1 transition-colors duration-300"
                      style={{ color: activeId === p.id ? 'white' : 'rgba(255,255,255,0.7)' }}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <MapPin style={{ width: 10, height: 10 }} />
                      {p.city}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-sm" style={{ color: '#00C896' }}>
                        {formatPrice(p.price)}
                        {p.type === 'RENT' && <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>/m</span>}
                      </p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: p.type === 'SALE' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
                          color: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        {p.type === 'SALE' ? 'Vente' : 'Loc.'}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 self-center transition-all duration-300"
                    style={{
                      color: activeId === p.id ? '#00C896' : 'rgba(255,255,255,0.15)',
                      transform: activeId === p.id ? 'translateX(2px)' : 'none',
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* ── MAP ── */}
          <div className="flex-1 relative">
            {/* Loading overlay */}
            {loading && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center"
                style={{ background: 'rgba(10,15,30,0.55)', backdropFilter: 'blur(4px)' }}
              >
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(0,200,150,0.15)', border: '1px solid rgba(0,200,150,0.3)' }}
                  >
                    <div
                      className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: '#00C896', borderTopColor: 'transparent' }}
                    />
                  </div>
                  <p className="font-bold text-white text-sm">Chargement de la carte</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Géolocalisation en cours…</p>
                </div>
              </div>
            )}

            <MapContainer center={center} zoom={6} style={{ width: '100%', height: '100%' }} className="z-10">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              {properties.map(p => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={mkIcon(p.type, p.isFeatured)}>
                  <Popup className="custom-popup">
                    <Link
                      to={`/property/${p.id}`}
                      className="block no-underline"
                      style={{ width: '220px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      {p.images?.[0] && (
                        <div style={{ margin: '-13px -13px 12px -13px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
                          <img
                            src={p.images[0]}
                            style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      )}
                      <div style={{ padding: '0 2px 4px' }}>
                        <p style={{ fontWeight: 700, color: '#0A0F1E', fontSize: '13px', lineHeight: '1.3', marginBottom: '6px' }}>
                          {p.title}
                        </p>
                        <p style={{ color: 'rgba(10,15,30,0.45)', fontSize: '11px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📍 {p.city}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <p style={{ fontWeight: 800, color: '#00C896', fontSize: '16px' }}>
                            {formatPrice(p.price)}
                            {p.type === 'RENT' && <span style={{ fontSize: '11px', color: 'rgba(10,15,30,0.35)', fontWeight: 500 }}>/m</span>}
                          </p>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '20px',
                              background: p.type === 'SALE' ? '#0A0F1E' : '#374151',
                              color: 'white',
                              letterSpacing: '0.06em',
                            }}
                          >
                            {p.type === 'SALE' ? 'VENTE' : 'LOC.'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Empty state */}
            {properties.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div
                  className="pointer-events-auto p-8 text-center max-w-xs mx-4 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                    border: '1px solid rgba(10,15,30,0.08)',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(10,15,30,0.05)' }}
                  >
                    <Home className="w-7 h-7" style={{ color: 'rgba(10,15,30,0.25)' }} />
                  </div>
                  <h3 className="font-display text-xl text-ink font-bold mb-2">Aucun bien trouvé</h3>
                  <p className="text-sm mb-5" style={{ color: 'rgba(10,15,30,0.4)', lineHeight: '1.6' }}>
                    Aucune annonce géolocalisée ne correspond à ces filtres.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-teal btn-sm w-full font-bold transition-transform duration-200 hover:scale-[1.02]"
                  >
                    Tout afficher
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}