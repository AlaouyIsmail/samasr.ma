import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/Navbar'
import { api, formatPrice, formatDate } from '../../lib/api'
import {
  LayoutDashboard, Home, Plus, Eye, Heart, Bookmark,
  MessageCircle, Bell, FileText, User, TrendingUp,
  AlertCircle, CheckCircle2, Trash2, X, Upload,
  MapPin, ChevronRight, ArrowUpRight, Zap
} from 'lucide-react'

type Tab = 'overview'|'properties'|'contracts'|'notifications'|'profile'

const CITIES=['Casablanca','Marrakech','Rabat','Tanger','Fès','Agadir','Meknès','Oujda']
const PTYPES=['apartment','villa','riad','land','commercial']

export function AgentDashboard() {
  const { user, agent, logout, refreshAgent } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [data, setData] = useState<any>(null)
  const [contracts, setContracts] = useState<any[]>([])
  const [notifs, setNotifs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddProp, setShowAddProp] = useState(false)
  const [showAddContract, setShowAddContract] = useState(false)
  const [propForm, setPropForm] = useState<any>({title:'',description:'',price:'',city:'Casablanca',district:'',type:'SALE',propertyType:'apartment',surface:'',rooms:'',bathrooms:'',lat:'',lng:'',images:[]})
  const [cForm, setCForm] = useState({type:'sale',clientName:'',clientPhone:'',propertyId:'',price:''})
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [profileForm, setProfileForm] = useState<any>({})
  const [profileLoading, setProfileLoading] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)

  useEffect(() => { loadAll() }, [])
  useEffect(() => {
    if (agent) setProfileForm({name:agent.name||'',phone:agent.phone||'',city:agent.city||'',bio:agent.bio||''})
  }, [agent])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [d,c,n] = await Promise.all([api.agentDashboard(),api.getContracts(),api.agentNotifications()])
      setData(d); setContracts(c); setNotifs(n)
    } catch {}
    setLoading(false)
  }

  const handleAddProp = async (e: any) => {
    e.preventDefault(); setFormError(''); setFormLoading(true)
    try {
      await api.createProperty({...propForm,price:+propForm.price,surface:+propForm.surface||undefined,rooms:+propForm.rooms||undefined,bathrooms:+propForm.bathrooms||undefined,lat:+propForm.lat||undefined,lng:+propForm.lng||undefined})
      setShowAddProp(false)
      setPropForm({title:'',description:'',price:'',city:'Casablanca',district:'',type:'SALE',propertyType:'apartment',surface:'',rooms:'',bathrooms:'',lat:'',lng:'',images:[]})
      await loadAll()
    } catch (err:any) { setFormError(err.message) }
    setFormLoading(false)
  }

  const handleDeleteProp = async (id: number) => {
    if (!confirm('Supprimer cette annonce ?')) return
    try { await api.deleteProperty(id); await loadAll() } catch {}
  }

  const handleAddContract = async (e: any) => {
    e.preventDefault(); setFormError(''); setFormLoading(true)
    try {
      await api.createContract({...cForm,price:+cForm.price||undefined,propertyId:+cForm.propertyId||undefined})
      setShowAddContract(false)
      setCForm({type:'sale',clientName:'',clientPhone:'',propertyId:'',price:''})
      const c = await api.getContracts(); setContracts(c)
    } catch (err:any) { setFormError(err.message) }
    setFormLoading(false)
  }

  const handleSignContract = async (id: number) => {
    try { await api.signContract(id); const c = await api.getContracts(); setContracts(c) } catch {}
  }

  const handleReadAll = async () => {
    try { await api.readAllNotifications(); const n = await api.agentNotifications(); setNotifs(n) } catch {}
  }

  const handleProfileSave = async (e: any) => {
    e.preventDefault(); setProfileLoading(true)
    try { await api.updateAgentProfile(profileForm); await refreshAgent() } catch {}
    setProfileLoading(false)
  }

  const handleImgUpload = async (e: any) => {
    const file = e.target.files[0]; if (!file) return
    setImgUploading(true)
    try {
      const url = await api.uploadImage(file)
      setPropForm((f:any) => ({...f,images:[...f.images,url]}))
    } catch {}
    setImgUploading(false)
  }

  const unread = notifs.filter(n => !n.isRead).length
  const stats = data?.stats || {}
  const properties: any[] = data?.properties || []

  const TABS: {id:Tab,label:string,icon:any}[] = [
    {id:'overview',label:'Tableau de bord',icon:LayoutDashboard},
    {id:'properties',label:'Mes annonces',icon:Home},
    {id:'contracts',label:'Contrats',icon:FileText},
    {id:'notifications',label:'Notifications',icon:Bell},
    {id:'profile',label:'Mon profil',icon:User},
  ]

  if (loading) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 space-y-4">
        {[1,2,3].map(i=><div key={i} className="skeleton h-24 rounded-2xl"/>)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pt-28">

        {/* Welcome header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="section-eyebrow">Espace agent</p>
            <h1 className="font-display text-4xl text-navy mt-1">
              Bonjour, {agent?.name?.split(' ')[0]} 
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {agent?.planActive
                ? <span className="inline-flex items-center gap-1.5 text-[11px] bg-sage/15 text-sage border border-sage/25 px-3 py-1.5 rounded-full font-heading font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3"/> Plan actif
                  </span>
                : <span className="inline-flex items-center gap-1.5 text-[11px] bg-terracotta/10 text-terracotta border border-terracotta/25 px-3 py-1.5 rounded-full font-heading font-bold uppercase tracking-wide">
                    <AlertCircle className="w-3 h-3"/> Plan inactif — Contactez l'admin
                  </span>
              }
              {unread > 0 && (
                <span className="text-[11px] bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-heading font-bold">
                  {unread} notification{unread>1?'s':''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-navy/6 p-2 sticky top-24 space-y-0.5 shadow-card">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-semibold transition-all duration-200 ${
                    tab===t.id ? 'bg-navy text-white shadow-sm' : 'text-navy/55 hover:bg-cream hover:text-navy'
                  }`}>
                  <t.icon className="w-4 h-4 flex-shrink-0"/>
                  <span className="flex-1 text-left">{t.label}</span>
                  {t.id==='notifications' && unread>0 && (
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab===t.id?'bg-gold text-white':'bg-red-500 text-white'}`}>{unread}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile tabs */}
          <div className="lg:hidden w-full mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${tab===t.id ? 'bg-navy text-white' : 'bg-white border border-navy/12 text-navy/55'}`}>
                  <t.icon className="w-3.5 h-3.5"/>{t.label}
                  {t.id==='notifications' && unread>0 && <span className="bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ── OVERVIEW ── */}
            {tab==='overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {l:'Vues',v:stats.totalViews||0,icon:'👁️',color:'text-blue-600',bg:'bg-blue-50'},
                    {l:'Likes',v:stats.totalLikes||0,icon:'❤️',color:'text-red-500',bg:'bg-red-50'},
                    {l:'Sauvegardés',v:stats.totalSaves||0,icon:'🔖',color:'text-gold',bg:'bg-gold/8'},
                    {l:'WhatsApp',v:stats.totalWhatsapp||0,icon:'💬',color:'text-green-600',bg:'bg-green-50'},
                  ].map(s => (
                    <div key={s.l} className={`${s.bg} rounded-2xl p-5`}>
                      <p className="text-3xl mb-2">{s.icon}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.v.toLocaleString()}</p>
                      <p className="text-[11px] text-navy/45 font-heading font-bold uppercase tracking-widest mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {l:'Annonces actives',v:`${stats.activeProperties||0}/${stats.totalProperties||0}`,icon:'🏠'},
                    {l:'Vues profil',v:stats.profileViews||0,icon:'👤'},
                    {l:'Contrats',v:contracts.length,icon:'📝'},
                  ].map(s => (
                    <div key={s.l} className="bg-white rounded-2xl border border-navy/6 p-5 shadow-card flex items-center gap-4">
                      <span className="text-3xl">{s.icon}</span>
                      <div>
                        <p className="font-heading font-bold text-navy text-xl">{typeof s.v==='number'?s.v.toLocaleString():s.v}</p>
                        <p className="text-[11px] text-navy/40 font-heading uppercase tracking-wide mt-0.5">{s.l}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent properties */}
                <div className="bg-white rounded-2xl border border-navy/6 shadow-card overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-5 border-b border-navy/6">
                    <h3 className="font-display text-xl text-navy">Mes annonces récentes</h3>
                    <button onClick={() => setTab('properties')} className="text-xs text-gold hover:text-gold-dark font-heading font-bold flex items-center gap-1">
                      Tout voir <ChevronRight className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                  {properties.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-navy/30 text-4xl mb-3">🏠</p>
                      <p className="text-navy/40 text-sm font-heading mb-5">Aucune annonce pour l'instant</p>
                      {agent?.planActive && (
                        <button onClick={() => {setTab('properties');setShowAddProp(true)}} className="btn-teal text-xs py-2.5 px-5">
                          <Plus className="w-3.5 h-3.5"/> Ajouter une annonce
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-navy/4">
                      {properties.slice(0,4).map((p:any) => (
                        <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors">
                          <img src={p.images?.[0]||'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&q=60'} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-navy text-sm truncate">{p.title}</p>
                            <p className="text-xs text-navy/40 mt-0.5">{formatPrice(p.price)} · {p.stats?.views||0} vues</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-heading font-bold ${p.status==='AVAILABLE'?'badge-sale':'text-[10px] bg-navy/8 text-navy/40 px-2.5 py-1 rounded-full font-heading font-bold'}`}>
                              {p.status==='AVAILABLE'?'Actif':'Inactif'}
                            </span>
                            <Link to={`/property/${p.id}`} className="w-7 h-7 bg-cream rounded-lg flex items-center justify-center hover:bg-navy/8 transition-colors">
                              <ArrowUpRight className="w-3.5 h-3.5 text-navy/50"/>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── PROPERTIES ── */}
            {tab==='properties' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-3xl text-navy">Mes annonces</h2>
                    <p className="text-navy/40 text-sm">{properties.length} bien{properties.length>1?'s':''}</p>
                  </div>
                  {agent?.planActive && (
                    <button onClick={() => setShowAddProp(true)} className="btn-teal text-sm py-2.5 px-5">
                      <Plus className="w-4 h-4"/> Nouvelle annonce
                    </button>
                  )}
                </div>

                {!agent?.planActive && (
                  <div className="bg-terracotta/8 border border-terracotta/25 rounded-2xl p-5 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5"/>
                    <p className="text-sm text-terracotta">Plan inactif. Contactez l'administrateur pour activer votre abonnement (349 MAD/mois) et commencer à publier.</p>
                  </div>
                )}

                {/* ADD PROPERTY MODAL */}
                {showAddProp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury">
                      <div className="flex justify-between items-center p-7 border-b border-navy/6">
                        <div>
                          <h3 className="font-display text-2xl text-navy">Nouvelle annonce</h3>
                          <p className="text-navy/40 text-sm">Remplissez les informations de votre bien</p>
                        </div>
                        <button onClick={() => setShowAddProp(false)} className="w-9 h-9 rounded-xl hover:bg-cream flex items-center justify-center transition-colors">
                          <X className="w-5 h-5 text-navy/40"/>
                        </button>
                      </div>
                      <form onSubmit={handleAddProp} className="p-7 space-y-4">
                        {formError && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0"/>{formError}
                          </div>
                        )}
                        <div>
                          <label className="label">Titre *</label>
                          <input value={propForm.title} onChange={e=>setPropForm({...propForm,title:e.target.value})} required className="field" placeholder="Ex: Appartement moderne Maarif"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label">Prix (MAD) *</label>
                            <input type="number" value={propForm.price} onChange={e=>setPropForm({...propForm,price:e.target.value})} required className="field" placeholder="1200000"/>
                          </div>
                          <div>
                            <label className="label">Transaction</label>
                            <select value={propForm.type} onChange={e=>setPropForm({...propForm,type:e.target.value})} className="field">
                              <option value="SALE">Vente</option>
                              <option value="RENT">Location</option>
                            </select>
                          </div>
                          <div>
                            <label className="label">Ville</label>
                            <select value={propForm.city} onChange={e=>setPropForm({...propForm,city:e.target.value})} className="field">
                              {CITIES.map(c=><option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="label">Quartier</label>
                            <input value={propForm.district} onChange={e=>setPropForm({...propForm,district:e.target.value})} className="field" placeholder="Maarif"/>
                          </div>
                          <div>
                            <label className="label">Type de bien</label>
                            <select value={propForm.propertyType} onChange={e=>setPropForm({...propForm,propertyType:e.target.value})} className="field">
                              {PTYPES.map(t=><option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="label">Surface (m²)</label>
                            <input type="number" value={propForm.surface} onChange={e=>setPropForm({...propForm,surface:e.target.value})} className="field" placeholder="120"/>
                          </div>
                          <div>
                            <label className="label">Chambres</label>
                            <input type="number" value={propForm.rooms} onChange={e=>setPropForm({...propForm,rooms:e.target.value})} className="field" placeholder="3"/>
                          </div>
                          <div>
                            <label className="label">Salles de bain</label>
                            <input type="number" value={propForm.bathrooms} onChange={e=>setPropForm({...propForm,bathrooms:e.target.value})} className="field" placeholder="2"/>
                          </div>
                          <div>
                            <label className="label">Latitude GPS</label>
                            <input type="number" step="any" value={propForm.lat} onChange={e=>setPropForm({...propForm,lat:e.target.value})} className="field" placeholder="33.5731"/>
                          </div>
                          <div>
                            <label className="label">Longitude GPS</label>
                            <input type="number" step="any" value={propForm.lng} onChange={e=>setPropForm({...propForm,lng:e.target.value})} className="field" placeholder="-7.5898"/>
                          </div>
                        </div>
                        <div>
                          <label className="label">Description</label>
                          <textarea value={propForm.description} onChange={e=>setPropForm({...propForm,description:e.target.value})} className="field" rows={3} placeholder="Description détaillée du bien..."/>
                        </div>
                        <div>
                          <label className="label">Photos</label>
                          <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gold/30 rounded-xl p-5 hover:border-gold/60 transition-colors bg-gold/3">
                            <Upload className="w-5 h-5 text-gold/60"/>
                            <span className="text-sm text-navy/50">{imgUploading ? 'Upload en cours...' : 'Cliquez pour uploader une image'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImgUpload} disabled={imgUploading}/>
                          </label>
                          {propForm.images.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {propForm.images.map((url:string,i:number) => (
                                <div key={i} className="relative group">
                                  <img src={url} className="w-16 h-16 rounded-xl object-cover"/>
                                  <button type="button" onClick={()=>setPropForm((f:any)=>({...f,images:f.images.filter((_:any,j:number)=>j!==i)}))}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <input className="field flex-1 text-sm py-2" placeholder="Ou coller URL d'image..." id="img-url"/>
                            <button type="button" onClick={()=>{const el=document.getElementById('img-url') as HTMLInputElement;if(el?.value){setPropForm((f:any)=>({...f,images:[...f.images,el.value]}));el.value=''}}} className="btn-outline text-xs py-2 px-3">Ajouter</button>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={formLoading} className="btn-teal flex-1 justify-center py-3.5 disabled:opacity-60">
                            {formLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Publier l\'annonce'}
                          </button>
                          <button type="button" onClick={()=>setShowAddProp(false)} className="btn-outline px-6">Annuler</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {properties.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-navy/6 p-14 text-center shadow-card">
                    <p className="text-5xl mb-4">🏠</p>
                    <h3 className="font-display text-2xl text-navy/60 mb-2">Aucune annonce</h3>
                    <p className="text-navy/35 text-sm mb-6">Publiez votre première annonce immobilière</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.map((p:any) => (
                      <div key={p.id} className="bg-white rounded-2xl border border-navy/6 p-5 flex gap-4 shadow-card hover:shadow-card-hover transition-all">
                        <img src={p.images?.[0]||'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=60'} className="w-24 h-20 rounded-xl object-cover flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-heading font-bold text-navy truncate">{p.title}</h4>
                              <p className="text-xs text-navy/40 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/>{p.city}{p.district?` · ${p.district}`:''}</p>
                              <p className="text-gold font-heading font-bold mt-1.5">{formatPrice(p.price)}</p>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <Link to={`/property/${p.id}`} className="w-8 h-8 bg-cream rounded-xl flex items-center justify-center hover:bg-navy/8 transition-colors">
                                <Eye className="w-3.5 h-3.5 text-navy/50"/>
                              </Link>
                              <button onClick={()=>handleDeleteProp(p.id)} className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                                <Trash2 className="w-3.5 h-3.5 text-red-400"/>
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-3 text-xs text-navy/35">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{p.stats?.views||0}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3"/>{p.stats?.likes||0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/>{p.stats?.whatsappClicks||0}</span>
                            <span className={`ml-auto text-[10px] px-2.5 py-0.5 rounded-full font-heading font-bold ${p.status==='AVAILABLE'?'bg-sage/12 text-sage':'bg-navy/8 text-navy/40'}`}>
                              {p.status==='AVAILABLE'?'Actif':'Inactif'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CONTRACTS ── */}
            {tab==='contracts' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-3xl text-navy">Mes contrats</h2>
                    <p className="text-navy/40 text-sm">{contracts.length} contrat{contracts.length>1?'s':''}</p>
                  </div>
                  <button onClick={()=>setShowAddContract(true)} className="btn-teal text-sm py-2.5 px-5">
                    <Plus className="w-4 h-4"/> Nouveau contrat
                  </button>
                </div>

                {showAddContract && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-luxury">
                      <div className="flex justify-between items-center p-7 border-b border-navy/6">
                        <h3 className="font-display text-2xl text-navy">Nouveau contrat</h3>
                        <button onClick={()=>setShowAddContract(false)} className="w-9 h-9 rounded-xl hover:bg-cream flex items-center justify-center">
                          <X className="w-5 h-5 text-navy/40"/>
                        </button>
                      </div>
                      <form onSubmit={handleAddContract} className="p-7 space-y-4">
                        {formError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{formError}</div>}
                        <div>
                          <label className="label">Type de contrat</label>
                          <select value={cForm.type} onChange={e=>setCForm({...cForm,type:e.target.value})} className="field">
                            <option value="sale">Compromis de vente</option>
                            <option value="rent">Contrat de location</option>
                            <option value="mandate">Mandat de vente</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">Nom du client *</label>
                          <input value={cForm.clientName} onChange={e=>setCForm({...cForm,clientName:e.target.value})} required className="field" placeholder="Mohammed Alami"/>
                        </div>
                        <div>
                          <label className="label">Téléphone client</label>
                          <input value={cForm.clientPhone} onChange={e=>setCForm({...cForm,clientPhone:e.target.value})} className="field" placeholder="+212600000000"/>
                        </div>
                        <div>
                          <label className="label">Annonce liée</label>
                          <select value={cForm.propertyId} onChange={e=>setCForm({...cForm,propertyId:e.target.value})} className="field">
                            <option value="">Aucune annonce</option>
                            {properties.map((p:any)=><option key={p.id} value={p.id}>{p.title}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">Prix (MAD)</label>
                          <input type="number" value={cForm.price} onChange={e=>setCForm({...cForm,price:e.target.value})} className="field" placeholder="1200000"/>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={formLoading} className="btn-teal flex-1 justify-center py-3.5 disabled:opacity-60">
                            {formLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><Zap className="w-4 h-4"/>Générer</>}
                          </button>
                          <button type="button" onClick={()=>setShowAddContract(false)} className="btn-outline px-6">Annuler</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {contracts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-navy/6 p-14 text-center shadow-card">
                    <p className="text-5xl mb-4">📝</p>
                    <h3 className="font-display text-2xl text-navy/60 mb-2">Aucun contrat</h3>
                    <p className="text-navy/35 text-sm">Générez votre premier contrat professionnel</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contracts.map((c:any) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-navy/6 p-6 shadow-card">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-heading font-bold text-navy">{c.clientName}</p>
                            <p className="text-sm text-navy/45 mt-0.5">
                              {c.type==='sale'?'Compromis de vente':c.type==='rent'?'Location':'Mandat'} · {formatDate(c.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-heading font-bold px-3 py-1.5 rounded-full ${c.status==='signed'?'bg-sage/15 text-sage':'bg-amber-100 text-amber-700'}`}>
                              {c.status==='signed'?'✓ Signé':'Brouillon'}
                            </span>
                            {c.status!=='signed' && (
                              <button onClick={()=>handleSignContract(c.id)} className="text-xs bg-navy text-white px-4 py-1.5 rounded-lg hover:bg-navy-700 transition-colors font-heading font-bold">Signer</button>
                            )}
                          </div>
                        </div>
                        <pre className="text-xs text-navy/50 bg-cream rounded-xl p-4 overflow-auto max-h-36 whitespace-pre-wrap font-mono leading-relaxed">{c.content}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab==='notifications' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-3xl text-navy">Notifications</h2>
                    <p className="text-navy/40 text-sm">{unread} non lue{unread>1?'s':''}</p>
                  </div>
                  {unread>0 && (
                    <button onClick={handleReadAll} className="text-sm text-gold hover:text-gold-dark font-heading font-semibold transition-colors">
                      Tout marquer lu
                    </button>
                  )}
                </div>
                {notifs.length===0 ? (
                  <div className="bg-white rounded-2xl border border-navy/6 p-14 text-center shadow-card">
                    <Bell className="w-12 h-12 text-navy/15 mx-auto mb-4"/>
                    <h3 className="font-display text-2xl text-navy/50">Aucune notification</h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifs.map((n:any) => (
                      <div key={n.id} className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-all ${n.isRead?'border-navy/6 opacity-65':'border-gold/25 shadow-sm'}`}>
                        <span className="text-xl mt-0.5">{n.type==='success'?'✅':n.type==='warning'?'⚠️':n.type==='error'?'❌':'ℹ️'}</span>
                        <div className="flex-1">
                          <p className="text-sm text-navy leading-relaxed">{n.message}</p>
                          <p className="text-[11px] text-navy/35 font-heading mt-2">{formatDate(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-2"/>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab==='profile' && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-2xl border border-navy/6 shadow-card p-8">
                  <h2 className="font-display text-3xl text-navy mb-6">Mon profil</h2>
                  <div className="gold-divider mb-8"/>
                  <form onSubmit={handleProfileSave} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="label">Nom complet</label>
                        <input value={profileForm.name||''} onChange={e=>setProfileForm({...profileForm,name:e.target.value})} className="field"/>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="label">Téléphone</label>
                        <input value={profileForm.phone||''} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})} className="field" placeholder="+212600000000"/>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="label">Ville d'activité</label>
                        <select value={profileForm.city||''} onChange={e=>setProfileForm({...profileForm,city:e.target.value})} className="field">
                          {CITIES.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="label">Bio professionnelle</label>
                        <textarea value={profileForm.bio||''} onChange={e=>setProfileForm({...profileForm,bio:e.target.value})} className="field" rows={3} placeholder="Décrivez votre expertise immobilière..."/>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-navy/6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-navy/35 font-heading">Email: <span className="text-navy/60 font-semibold">{user?.email}</span></p>
                        <p className="text-xs text-navy/35 font-heading">Plan: <span className={`font-bold ${agent?.planActive?'text-sage':'text-terracotta'}`}>{agent?.planActive?'Actif ✓':'Inactif'}</span></p>
                      </div>
                      <button type="submit" disabled={profileLoading} className="btn-primary py-3 px-8 disabled:opacity-60">
                        {profileLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
