import { useState } from 'react'
import { Link } from 'react-router'
import {
  Heart,
  Bookmark,
  Eye,
  MessageCircle,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
} from 'lucide-react'

import { api, formatPrice } from '../../lib/api'

export function PropertyCard({
  p,
  delay = 0,
}: {
  p: any
  delay?: number
}) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(p.stats?.likes || 0)

  const img =
    Array.isArray(p.images) && p.images.length
      ? p.images[0]
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'

  const onLike = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await api.likeProperty(p.id)
      setLiked(!liked)
      setLikes((n: number) => (liked ? n - 1 : n + 1))
    } catch {}
  }

  const onSave = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await api.saveProperty(p.id)
      setSaved(!saved)
    } catch {}
  }

  return (
    <Link
      to={`/property/${p.id}`}
      className="
        group block overflow-hidden rounded-[28px]
        border border-ink/6 bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1.5
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]
      "
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* IMAGE */}
      <div
        className="relative overflow-hidden bg-pearl"
        style={{ aspectRatio: '16/10' }}
      >
        <img
          src={img}
          alt={p.title}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.04]
          "
          onError={(e: any) => {
            e.target.src =
              'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80'
          }}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        {/* top section */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="flex gap-2">
            <span
              className={`
                badge
                ${p.type === 'SALE' ? 'badge-sale' : 'badge-rent'}
                shadow-lg backdrop-blur-md
              `}
            >
              {p.type === 'SALE' ? 'Vente' : 'Location'}
            </span>

            {p.isFeatured && (
              <span className="badge badge-feat shadow-lg backdrop-blur-md">
                <Star className="w-2.5 h-2.5 fill-current" />
                Vedette
              </span>
            )}
          </div>

          {/* actions */}
          <div
            className="
              flex gap-2
              opacity-0 translate-y-2
              transition-all duration-300
              group-hover:opacity-100
              group-hover:translate-y-0
            "
          >
            <button
              onClick={onSave}
              className={`
                flex h-10 w-10 items-center justify-center
                rounded-2xl backdrop-blur-md
                shadow-lg transition-all duration-200
                ${
                  saved
                    ? 'bg-amber text-white'
                    : 'bg-white/90 text-ink hover:bg-amber hover:text-white'
                }
              `}
            >
              <Bookmark
                className="w-4 h-4"
                fill={saved ? 'currentColor' : 'none'}
              />
            </button>

            <button
              onClick={onLike}
              className={`
                flex h-10 w-10 items-center justify-center
                rounded-2xl backdrop-blur-md
                shadow-lg transition-all duration-200
                ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-ink hover:bg-red-500 hover:text-white'
                }
              `}
            >
              <Heart
                className="w-4 h-4"
                fill={liked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* price */}
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className="
              inline-flex flex-col rounded-2xl
              bg-white/95 px-5 py-3
              backdrop-blur-md shadow-2xl
            "
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">
              Prix
            </span>

            <p className="font-display text-2xl leading-none text-ink">
              {formatPrice(p.price)}

              {p.type === 'RENT' && (
                <span className="ml-1 text-sm text-ink/45 font-medium">
                  /mois
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5">

        {/* location */}
        <div className="flex items-center gap-1.5 text-xs text-ink/45 font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal" />

          <span>
            {p.district ? `${p.district}, ` : ''}
            {p.city}
          </span>
        </div>

        {/* title */}
        <h3
          className="
            mt-3 text-[1.05rem] font-bold leading-snug
            text-ink line-clamp-2
            transition-colors duration-200
            group-hover:text-teal
          "
        >
          {p.title}
        </h3>

        {/* specs */}
        {(p.rooms || p.bathrooms || p.surface) && (
          <div className="mt-5 grid grid-cols-3 gap-3">

            <div
              className="
                rounded-2xl border border-ink/6
                bg-pearl p-3 text-center
                transition-all duration-200
                hover:bg-teal hover:text-white
              "
            >
              <Bed className="mx-auto mb-1.5 w-4 h-4" />

              <p className="text-sm font-bold">
                {p.rooms || 0}
              </p>

              <span className="text-[10px] uppercase tracking-wide opacity-70">
                Chambres
              </span>
            </div>

            <div
              className="
                rounded-2xl border border-ink/6
                bg-pearl p-3 text-center
                transition-all duration-200
                hover:bg-teal hover:text-white
              "
            >
              <Bath className="mx-auto mb-1.5 w-4 h-4" />

              <p className="text-sm font-bold">
                {p.bathrooms || 0}
              </p>

              <span className="text-[10px] uppercase tracking-wide opacity-70">
                SDB
              </span>
            </div>

            <div
              className="
                rounded-2xl border border-ink/6
                bg-pearl p-3 text-center
                transition-all duration-200
                hover:bg-teal hover:text-white
              "
            >
              <Maximize2 className="mx-auto mb-1.5 w-4 h-4" />

              <p className="text-sm font-bold">
                {p.surface || 0}
              </p>

              <span className="text-[10px] uppercase tracking-wide opacity-70">
                m²
              </span>
            </div>
          </div>
        )}

        {/* footer */}
        <div className="mt-5 flex items-center justify-between border-t border-ink/6 pt-4">

          {/* stats */}
          <div className="flex items-center gap-3 text-ink/35">
            <span className="flex items-center gap-1 text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              {p.stats?.views || 0}
            </span>

            <span className="flex items-center gap-1 text-xs font-medium">
              <Heart className="w-3.5 h-3.5" />
              {likes}
            </span>

            <span className="flex items-center gap-1 text-xs font-medium">
              <MessageCircle className="w-3.5 h-3.5" />
              {p.stats?.whatsappClicks || 0}
            </span>
          </div>

          {/* agent */}
          {p.agent && (
            <div
              className="
                rounded-full bg-pearl
                px-3 py-1
                text-[11px] font-semibold text-ink/50
              "
            >
              {p.agent.name?.split(' ')[0]}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}