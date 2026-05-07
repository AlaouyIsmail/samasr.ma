import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Trash2, Info } from 'lucide-react'
import { api, formatDate } from '../../lib/api'

export function NotificationsMenu({ transparent }: { transparent: boolean }) {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<any[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await api.agentNotifications()
        setNotifs(data || [])
        setUnread(data.filter((n: any) => !n.isRead).length)
      } catch (e) {}
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = async () => {
    try {
      await api.readAllNotifications()
      setNotifs(notifs.map(n => ({ ...n, isRead: true })))
      setUnread(0)
    } catch {}
  }

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl transition-all relative group ${
          transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-ink/60 hover:text-ink hover:bg-ink/5'
        }`}
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        {unread > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping-slow opacity-75" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-[-40px] md:right-0 mt-3 w-[90vw] max-w-[380px] bg-white rounded-2xl shadow-2xl shadow-ink/10 border border-ink/5 overflow-hidden z-50 animate-fade-in md:origin-top-right">
          <div className="p-4 border-b border-ink/5 flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-ink flex items-center gap-2">
              Notifications
              {unread > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">{unread}</span>}
            </h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-teal font-medium hover:text-teal-dark flex items-center gap-1 transition-colors bg-teal/10 hover:bg-teal/20 px-2 py-1 rounded-md">
                <Check className="w-3.5 h-3.5" /> Marquer lu
              </button>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto overscroll-contain pb-2">
            {notifs.length === 0 ? (
              <div className="p-8 text-center text-ink/40 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium">Aucune notification</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifs.map((n) => (
                  <div key={n.id} className={`p-4 border-b border-ink/5 last:border-0 hover:bg-gray-50 transition-colors flex gap-3 group relative overflow-hidden ${!n.isRead ? 'bg-teal/5 hover:bg-teal/10' : ''}`}>
                    {/* Indicator line */}
                    {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal rounded-r-full" />}
                    
                    <div className={`mt-1 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${!n.isRead ? 'bg-teal text-white' : 'bg-white text-ink border border-ink/10'}`}>
                      <Info className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-snug ${!n.isRead ? 'text-ink font-semibold' : 'text-ink/80 font-medium'}`}>{n.message}</p>
                      <span className="text-xs text-ink/40 mt-1.5 block">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
