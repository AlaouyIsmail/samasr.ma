import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { api } from '../../lib/api'
import { PropertyCard } from '../components/PropertyCard'
import { MapPin, Phone, Mail, Grid, Instagram, Facebook } from 'lucide-react'

export function AgentProfilePublic() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAgentPublic(id)
      .then(res => setData(res))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-24 text-center py-20 text-ink/40 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-teal border-t-transparent animate-spin"></div></div>
  if (!data || !data.agent) return <div className="min-h-screen pt-24 text-center py-20 font-medium text-ink"><p>Agent introuvable</p><Link to="/properties" className="text-teal hover:underline mt-4 inline-block">Retour aux annonces</Link></div>

  const { agent, stats, properties } = data

  return (
    <main className="min-h-screen pt-24 pb-20 bg-pearl-warm">
      <div className="container max-w-4xl">
        {/* PROFILE HEADER (Instagram style) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-ink/5 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            
            {/* AVATAR */}
            <div className="shrink-0 relative">
              {agent.photo ? (
                <img src={agent.photo} alt={agent.name} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-pearl object-cover shadow-md" />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-teal border-4 border-pearl shadow-md flex items-center justify-center text-white font-display text-5xl font-bold">
                  {agent.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* INFO & STATS */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">{agent.name}</h1>
                  <p className="text-ink/60 flex items-center justify-center sm:justify-start gap-1 mt-1 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-teal" /> {agent.city || 'Maroc'}
                  </p>
                </div>
                
                {/* CTA BUTTON */}
                <div className="flex gap-2 justify-center sm:justify-end">
                  <a href={`tel:${agent.phone}`} className="btn-teal px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" /> Appeler
                  </a>
                </div>
              </div>

              {/* STATS (Instagram style) */}
              <div className="flex justify-center sm:justify-start gap-10 mb-6 border-y border-ink/5 py-4 sm:border-0 sm:py-0">
                <div className="text-center sm:text-left">
                  <span className="block font-bold text-2xl text-ink">{properties?.length || 0}</span>
                  <span className="text-sm text-ink/60 font-medium">Annonces</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="block font-bold text-2xl text-ink">{stats?.profileViews || 1}</span>
                  <span className="text-sm text-ink/60 font-medium">Vues recues</span>
                </div>
              </div>

              {/* BIO / DETAILS */}
              <div className="text-ink/80 text-sm max-w-lg mb-4 leading-relaxed">
                {agent.bio ? (
                  <p>{agent.bio}</p>
                ) : (
                  <p>Agent immobilier rattaché à SAMSAR basé à {agent.city || 'Maroc'}. Spécialiste dans la location et la vente de biens immobiliers de qualité.</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-ink/70 justify-center sm:justify-start">
                <div className="flex items-center gap-2 bg-ink/5 px-3 py-1.5 rounded-lg">
                  <Mail className="w-4 h-4" /> {agent.email}
                </div>
                {agent.phone && (
                  <div className="flex items-center gap-2 bg-ink/5 px-3 py-1.5 rounded-lg">
                    <Phone className="w-4 h-4" /> {agent.phone}
                  </div>
                )}
                {/* Simulated Social Links for the "Instagram like" request */}
                <div className="flex items-center gap-3 ml-2">
                   <a href="#" className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-teal hover:text-white transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></a>
                   <a href="#" className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center hover:bg-info hover:text-white transition-colors cursor-pointer"><Facebook className="w-4 h-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTIES GRID */}
        <div>
          <div className="flex items-center justify-center gap-2 border-t border-ink/5 pt-6 pb-6 text-ink/80 font-bold uppercase tracking-wider text-sm">
             <Grid className="w-5 h-5" /> Publications
          </div>

          {properties && properties.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
             </div>
          ) : (
             <div className="text-center py-20 text-ink/40 bg-white rounded-3xl border border-ink/5 flex flex-col items-center">
               <Grid className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-medium">Aucune annonce disponible</p>
               <p className="text-sm mt-1">Cet agent n'a encore rien publié.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  )
}
