import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { Navbar } from '../components/Navbar'
import { PropertyCard } from '../components/PropertyCard'
import { api } from '../../lib/api'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const CITIES = ['Casablanca','Marrakech','Rabat','Tanger','Fès','Agadir','Meknès','Oujda']
const TYPES = [
  {label:'Appartement',val:'apartment'},{label:'Villa',val:'villa'},
  {label:'Riad',val:'riad'},{label:'Terrain',val:'land'},{label:'Commercial',val:'commercial'},
]
const BUDGETS = [
  {label:'Tous prix',min:'',max:''},
  {label:'< 500k MAD',min:'',max:'500000'},
  {label:'500k — 1M',min:'500000',max:'1000000'},
  {label:'1M — 3M',min:'1000000',max:'3000000'},
  {label:'> 3M MAD',min:'3000000',max:''},
]

export function Properties() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState<any>({ data:[], total:0, totalPages:0 })
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const city = params.get('city') || ''
  const propertyType = params.get('propertyType') || ''
  const type = params.get('type') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const activeCount = [city, propertyType, type, minPrice, maxPrice].filter(Boolean).length

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (city) q.set('city', city)
    if (propertyType) q.set('propertyType', propertyType)
    if (type) q.set('type', type)
    if (minPrice) q.set('minPrice', minPrice)
    if (maxPrice) q.set('maxPrice', maxPrice)
    q.set('page', String(page))
    q.set('limit', '12')
    api.getProperties(q.toString()).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [city, propertyType, type, minPrice, maxPrice, page])

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v); else p.delete(k)
    setParams(p); setPage(1)
  }
  const clear = () => { setParams({}); setPage(1) }

  return (
    <div className="min-h-screen bg-pearl-warm">
      <Navbar />

      {/* Hero bar */}
      <div className="bg-ink pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid"/>
        <div className="container relative z-10 mt-2">
          <p className="eyebrow mb-2 mt-4 text-teal/80">Catalogue</p>
          <h1 className="font-display text-5xl text-white">Annonces immobilières</h1>
          <p className="text-white/35 mt-2 text-sm font-medium">
            {loading ? '...' : `${data.total} bien${data.total !== 1 ? 's' : ''} disponible${data.total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          {/* Type pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {TYPES.map(t => (
              <button key={t.val} onClick={() => set('propertyType', propertyType === t.val ? '' : t.val)}
                className={propertyType === t.val ? 'pill-active' : 'pill-idle'}>
                {t.label}
              </button>
            ))}
            <button onClick={() => set('type', type === 'SALE' ? '' : 'SALE')}
              className={type === 'SALE' ? 'pill-active' : 'pill-idle'}>Vente</button>
            <button onClick={() => set('type', type === 'RENT' ? '' : 'RENT')}
              className={type === 'RENT' ? 'pill-active' : 'pill-idle'}>Location</button>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              showFilters || activeCount > 0 ? 'bg-ink text-white border-ink' : 'bg-white border-ink/12 text-ink/60 hover:border-ink/30 hover:text-ink'
            }`}>
            <SlidersHorizontal className="w-4 h-4"/>
            Filtres
            {activeCount > 0 && <span className="w-5 h-5 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center">{activeCount}</span>}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="card p-6 mb-6 shadow-sm animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Ville</label>
                <select value={city} onChange={e => set('city', e.target.value)} className="field">
                  <option value="">Toutes les villes</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Type de bien</label>
                <select value={propertyType} onChange={e => set('propertyType', e.target.value)} className="field">
                  <option value="">Tous</option>
                  {TYPES.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Transaction</label>
                <select value={type} onChange={e => set('type', e.target.value)} className="field">
                  <option value="">Vente & Location</option>
                  <option value="SALE">Vente</option>
                  <option value="RENT">Location</option>
                </select>
              </div>
              <div>
                <label className="label">Budget</label>
                <select onChange={e => {
                  const [mn, mx] = e.target.value.split('|')
                  set('minPrice', mn || ''); set('maxPrice', mx || '')
                }} className="field">
                  {BUDGETS.map(b => <option key={b.label} value={`${b.min}|${b.max}`}>{b.label}</option>)}
                </select>
              </div>
            </div>
            {activeCount > 0 && (
              <button onClick={clear} className="mt-4 flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition-colors font-semibold">
                <X className="w-3.5 h-3.5"/> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden border border-ink/6 bg-white">
                <div className="skeleton" style={{aspectRatio:'16/10'}}/>
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 rounded-lg w-3/4"/>
                  <div className="skeleton h-3 rounded-lg w-1/2"/>
                  <div className="skeleton h-3 rounded-lg w-full"/>
                </div>
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-6">🏠</p>
            <h3 className="font-display text-3xl text-ink/50 mb-3">Aucun résultat</h3>
            <p className="text-ink/35 text-sm mb-8">Modifiez vos critères pour trouver votre bien idéal</p>
            <button onClick={clear} className="btn-teal">Réinitialiser les filtres</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((p: any, i: number) => <PropertyCard key={p.id} p={p} delay={i * 55}/>)}
            </div>
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                <button onClick={() => setPage(n => Math.max(1, n-1))} disabled={page <= 1}
                  className="w-10 h-10 rounded-xl border border-ink/12 bg-white flex items-center justify-center hover:border-ink/30 disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-5 h-5 text-ink"/>
                </button>
                <div className="flex gap-1">
                  {Array.from({length: data.totalPages}, (_, i) => i+1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${n === page ? 'bg-ink text-white' : 'text-ink/40 hover:bg-ink/6 hover:text-ink'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage(n => Math.min(data.totalPages, n+1))} disabled={page >= data.totalPages}
                  className="w-10 h-10 rounded-xl border border-ink/12 bg-white flex items-center justify-center hover:border-ink/30 disabled:opacity-30 transition-all">
                  <ChevronRight className="w-5 h-5 text-ink"/>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
