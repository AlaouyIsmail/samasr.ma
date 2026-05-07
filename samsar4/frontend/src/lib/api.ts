const BASE = import.meta.env.VITE_API_URL || '/api'
function getToken() { return localStorage.getItem('samsar_token') }
async function req(path: string, opts: RequestInit = {}) {
  const token = getToken()
  const isFormData = opts.body instanceof FormData
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) {
    let msg = res.statusText
    try { const e = await res.json(); msg = Array.isArray(e.message) ? e.message[0] : (e.message || msg) } catch {}
    throw new Error(msg)
  }
  return res.json()
}
export const api = {
  register: (d: any) => req('/auth/register', { method: 'POST', body: JSON.stringify(d) }),
  login: (d: any) => req('/auth/login', { method: 'POST', body: JSON.stringify(d) }),
  me: () => req('/auth/me'),
  getProperties: (params = '') => req(`/properties?${params}`),
  getProperty: (id: any) => req(`/properties/${id}`),
  likeProperty: (id: any) => req(`/properties/${id}/like`, { method: 'POST' }),
  saveProperty: (id: any) => req(`/properties/${id}/save`, { method: 'POST' }),
  whatsappClick: (id: any) => req(`/properties/${id}/whatsapp-click`, { method: 'POST' }),
  createProperty: (d: any) => req('/properties', { method: 'POST', body: JSON.stringify(d) }),
  updateProperty: (id: number, d: any) => req(`/properties/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  deleteProperty: (id: number) => req(`/properties/${id}`, { method: 'DELETE' }),
  agentDashboard: () => req('/agent/dashboard'),
  agentProfile: () => req('/agent/profile'),
  updateAgentProfile: (d: any) => req('/agent/profile', { method: 'PATCH', body: JSON.stringify(d) }),
  agentNotifications: () => req('/agent/notifications'),
  readAllNotifications: () => req('/agent/notifications/read-all', { method: 'POST' }),
  getAgentPublic: (id: any) => req(`/agents/${id}`),
  createContract: (d: any) => req('/contracts', { method: 'POST', body: JSON.stringify(d) }),
  getContracts: () => req('/contracts'),
  getContract: (id: number) => req(`/contracts/${id}`),
  signContract: (id: number) => req(`/contracts/${id}/sign`, { method: 'POST' }),
  adminStats: () => req('/admin/stats'),
  adminAgents: () => req('/admin/agents'),
  activateAgent: (id: number) => req(`/admin/activate-agent/${id}`, { method: 'POST' }),
  deactivateAgent: (id: number) => req(`/admin/deactivate-agent/${id}`, { method: 'POST' }),
  adminProperties: () => req('/admin/properties'),
  sendNotification: (d: any) => req('/admin/notify', { method: 'POST', body: JSON.stringify(d) }),
  uploadImage: async (file: File): Promise<string> => {
    const fd = new FormData(); fd.append('file', file)
    const token = getToken()
    const res = await fetch(`${BASE}/upload/image`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd })
    if (!res.ok) throw new Error('Upload échoué')
    return (await res.json()).url
  },
}
export const formatPrice = (p: number) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(p)
export const formatDate = (d: any) => new Intl.DateTimeFormat('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))

// Extra admin methods
export const adminExtra = {
  pendingAgents: () => req('/admin/agents/pending'),
}
