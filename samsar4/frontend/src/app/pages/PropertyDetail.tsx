import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { Navbar } from '../components/Navbar'
import { api, formatPrice, formatDate } from '../../lib/api'
import { Heart, Bookmark, Eye, MessageCircle, MapPin, Bed, Bath, Maximize2, ChevronLeft, ChevronRight, Phone, Star, ArrowLeft, Share2, TrendingUp } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    if (!id) return
    api.getProperty(id).then(p => { setProperty(p); setLikes(p.stats?.likes || 0) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-pearl-warm">
      <div className="container pt-28 space-y-6">
        <div className="skeleton rounded-3xl" style={{height:'520px'}}/>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="skeleton h-12 rounded-xl w-3/4"/>
            <div className="skeleton h-5 rounded-xl w-1/2"/>
            <div className="skeleton h-48 rounded-2xl"/>
          </div>
          <div className="skeleton h-80 rounded-2xl"/>
        </div>
      </div>
    </div>
  )

  if (!property) return (
    <div className="min-h-screen bg-pearl-warm flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-center p-6">
        <div>
          <p className="font-display text-9xl text-ink/8 mb-4">404</p>
          <h2 className="font-display text-3xl text-ink mb-4">Annonce introuvable</h2>
          <Link to="/properties" className="btn-primary">Retour aux annonces</Link>
        </div>
      </div>
    </div>
  )

  const images = Array.isArray(property.images) && property.images.length
    ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85']

  const handleWA = async () => {
    try { await api.whatsappClick(id) } catch {}
    const msg = encodeURIComponent(`Bonjour, je suis intéressé(e) par:\n\n📍 *${property.title}*\n💰 ${formatPrice(property.price)}${property.type==='RENT'?'/mois':''}\n🏙️ ${property.city}\n\nMerci de me contacter.`)
    window.open(`https://wa.me/${(property.agent?.phone||'+212600000000').replace(/[^\d]/g,'')}?text=${msg}`, '_blank')
  }

  const handleLike = async () => { try { await api.likeProperty(id); setLiked(!liked); setLikes((n:number)=>liked?n-1:n+1) } catch {} }
  const handleSave = async () => { try { await api.saveProperty(id); setSaved(!saved) } catch {} }
  const handleShare = () => { try { navigator.clipboard.writeText(window.location.href) } catch {} }

  return (
    <div className="min-h-screen bg-pearl-warm">
      {/* <Navbar /> */}

      {/* GALLERY */}
      <div className="relative bg-ink" style={{height:'72vh',minHeight:'420px'}}>
        {images.map((img:string, i:number) => (
          <div key={i} className={`absolute inset-0 transition-all duration-700 ${i===imgIdx?'opacity-100 z-10':'opacity-0 z-0'}`}>
            <img src={img} alt={property.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"/>
          </div>
        ))}

        {/* Back btn */}
        <div className="absolute top-24 left-5 sm:left-8 z-20">
          <Link to="/properties" className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-xl bg-ink/40 backdrop-blur-sm border border-white/10 hover:bg-ink/60 transition-all">
            <ArrowLeft className="w-4 h-4"/> Retour
          </Link>
        </div>

        {/* Top right actions */}
        <div className="absolute top-24 right-5 sm:right-8 z-20 flex gap-2">
          {[
            { fn: handleShare, icon: Share2, active: false, activeClass: '' },
            { fn: handleSave,  icon: Bookmark, active: saved, activeClass: 'bg-amber-500 text-white border-amber-500' },
            { fn: handleLike,  icon: Heart,    active: liked, activeClass: 'bg-red-500 text-white border-red-500' },
          ].map((a, i) => (
            <button key={i} onClick={a.fn}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${a.active ? a.activeClass : 'bg-ink/40 backdrop-blur-sm border-white/10 text-white hover:bg-ink/60'}`}>
              <a.icon className="w-4 h-4" fill={a.active ? 'currentColor' : 'none'}/>
            </button>
          ))}
        </div>

        {/* Badges bottom-left */}
        <div className="absolute bottom-6 left-5 sm:left-8 z-20 flex gap-2">
          <span className={`badge ${property.type==='SALE'?'badge-sale':'badge-rent'} text-xs px-3 py-1.5`}>
            {property.type==='SALE'?'Vente':'Location'}
          </span>
          {property.isFeatured && <span className="badge badge-feat text-xs px-3 py-1.5"><Star className="w-3 h-3 fill-current"/> Vedette</span>}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-ink/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-ink/70 transition-all">
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <button onClick={()=>setImgIdx(i=>(i+1)%images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-ink/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-ink/70 transition-all">
              <ChevronRight className="w-5 h-5"/>
            </button>
            <div className="absolute bottom-6 right-5 sm:right-8 z-20 flex gap-1.5">
              {images.map((_:any,i:number)=>(
                <button key={i} onClick={()=>setImgIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i===imgIdx?'bg-white w-6 h-2':'bg-white/40 w-2 h-2'}`}/>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="bg-white border-b border-ink/6 px-5 py-3">
          <div className="container flex gap-2">
            {images.map((img:string,i:number)=>(
              <button key={i} onClick={()=>setImgIdx(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${i===imgIdx?'border-teal shadow-teal-sm':'border-transparent opacity-55 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>
      )}

    {/* PAGE */}
<div className="container py-10">

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

    {/* LEFT */}
    <div className="lg:col-span-2 space-y-8">

      {/* HERO CARD */}
      <div className="card p-10 space-y-6 bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm">

        {/* TITLE */}
        <div>
          <h1 className="font-display text-4xl text-slate-900 leading-tight">
            {property.title}
          </h1>

          <p className="flex items-center gap-2 text-slate-500 text-sm mt-3">
            <MapPin className="w-4 h-4 text-teal-500" />
            {property.district ? `${property.district}, ` : ''}
            {property.city}
          </p>
        </div>

        {/* PRICE + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <div>
            <p className="text-xs tracking-widest uppercase text-slate-400">
              Prix
            </p>

            <p className="font-display text-5xl text-slate-900 mt-2">
              {formatPrice(property.price)}
              {property.type === 'RENT' && (
                <span className="text-lg text-slate-400 ml-2">
                  /mois
                </span>
              )}
            </p>
          </div>

          {/* PRIMARY CTA */}
          <button
            onClick={handleWA}
            className="px-8 py-4 rounded-2xl text-white font-semibold shadow-md hover:shadow-xl transition-all flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg,#25D366,#128C7E)'
            }}
          >
            Contacter l’agent
          </button>
        </div>

        {/* QUICK INFO BAR (Airbnb style) */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">

          {[
            { icon: Bed, label: 'Chambres', val: property.rooms },
            { icon: Bath, label: 'Sdb', val: property.bathrooms },
            { icon: Maximize2, label: 'Surface', val: property.surface }
          ]
            .filter(i => i.val)
            .map((item) => (
              <div
                key={item.label}
                className="text-center bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition"
              >
                <item.icon className="w-5 h-5 text-teal-500 mx-auto mb-2" />
                <p className="text-lg font-semibold text-slate-900">
                  {item.val}
                </p>
                <p className="text-xs text-slate-400 uppercase">
                  {item.label}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* DESCRIPTION */}
      {property.description && (
        <div className="card p-8">
          <h3 className="font-display text-2xl text-slate-900 mb-4">
            Description
          </h3>

          <p className="text-slate-600 leading-relaxed">
            {property.description}
          </p>
        </div>
      )}

      {/* MAP */}
      {property.lat && property.lng && (
        <div className="card p-8">
          <h3 className="font-display text-2xl mb-4">
            Localisation
          </h3>

          <MapContainer
            center={[property.lat, property.lng]}
            zoom={16}
            style={{ height: '320px' }}
            className="rounded-2xl overflow-hidden"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[property.lat, property.lng]} />
          </MapContainer>
        </div>
      )}

    </div>

    {/* RIGHT SIDEBAR */}
    <div className="space-y-6 sticky top-24">

      {/* AGENT CARD */}
      <div className="card p-6 border border-slate-100">

        <p className="text-xs text-slate-400 uppercase mb-4">
          Agent
        </p>

        <Link to={`/agent-profile/${property.agentId}`} className="flex items-center gap-3 mb-5 hover:bg-slate-50 p-2 -ml-2 rounded-2xl transition-colors cursor-pointer group">
          {property.agent?.photo ? (
            <img
              src={property.agent.photo}
              className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold group-hover:scale-105 transition-transform">
              {property.agent?.name?.[0]}
            </div>
          )}

          <div>
            <p className="font-semibold text-slate-900 group-hover:text-teal transition-colors flex items-center gap-1">
              {property.agent?.name}
            </p>
            <p className="text-xs text-slate-400">
              {property.agent?.city || "Voir le profil"}
            </p>
          </div>
        </Link>

        {/* CONTACT ACTIONS */}
        <div className="space-y-3">

          <button
            onClick={handleWA}
            className="w-full py-3 rounded-xl text-white font-medium"
            style={{
              background: 'linear-gradient(135deg,#25D366,#128C7E)'
            }}
          >
            WhatsApp
          </button>

          {property.agent?.phone && (
            <a
              href={`tel:${property.agent.phone}`}
              className="block text-center py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              Appeler
            </a>
          )}
        </div>
      </div>

      {/* STATS (trust block) */}
      <div className="card p-6">

        <p className="text-xs text-slate-400 uppercase mb-4">
          Activité
        </p>

        <div className="space-y-3 text-sm">

          {[
            { l: 'Vues', v: property.stats?.views || 0 },
            { l: 'Sauvegardes', v: property.stats?.saves || 0 },
            { l: 'WhatsApp', v: property.stats?.whatsappClicks || 0 }
          ].map((s) => (
            <div key={s.l} className="flex justify-between">
              <span className="text-slate-500">{s.l}</span>
              <span className="font-semibold text-slate-900">
                {s.v}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* DATE */}
      <div className="text-center text-xs text-slate-400">
        Publiée le{" "}
        <span className="text-slate-700 font-medium">
          {formatDate(property.createdAt)}
        </span>
      </div>

    </div>
  </div>
</div>
    </div>
  )
}
