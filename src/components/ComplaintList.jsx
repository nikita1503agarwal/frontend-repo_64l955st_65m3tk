import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, Hammer, Search } from 'lucide-react'

const statusMap = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-300', icon: <Clock className="w-4 h-4" /> },
  process: { label: 'In Process', color: 'bg-blue-500/20 text-blue-300', icon: <Hammer className="w-4 h-4" /> },
  complete: { label: 'Complete', color: 'bg-emerald-500/20 text-emerald-300', icon: <CheckCircle2 className="w-4 h-4" /> },
}

export default function ComplaintList({ backendUrl, onAssign, onUpdate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ status: '', priority: '', q: '' })

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      const res = await fetch(`${backendUrl}/api/complaints?${params.toString()}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority])

  const handleSearch = (e) => {
    setFilters((f) => ({ ...f, q: e.target.value.toLowerCase() }))
  }

  const filtered = items.filter((it) =>
    !filters.q ||
    it.subject.toLowerCase().includes(filters.q) ||
    it.customer_name.toLowerCase().includes(filters.q)
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded px-3 py-2 text-blue-100">
          <Search className="w-4 h-4" />
          <input onChange={handleSearch} placeholder="Search subject or customer" className="bg-transparent outline-none placeholder:text-blue-300/50 text-sm" />
        </div>
        <select value={filters.status} onChange={(e)=> setFilters((f)=> ({...f, status: e.target.value}))} className="bg-slate-800/60 text-blue-100 rounded px-3 py-2">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="process">In Process</option>
          <option value="complete">Complete</option>
        </select>
        <select value={filters.priority} onChange={(e)=> setFilters((f)=> ({...f, priority: e.target.value}))} className="bg-slate-800/60 text-blue-100 rounded px-3 py-2">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button onClick={fetchItems} className="ml-auto px-3 py-2 rounded bg-slate-700/70 text-blue-100 hover:bg-slate-700">Reload</button>
      </div>

      <div className="grid gap-3">
        {loading && <div className="text-blue-200">Loading...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-blue-200/80">No complaints found.</div>
        )}
        {filtered.map((it) => (
          <div key={it.id} className="bg-slate-800/60 border border-blue-500/10 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${statusMap[it.status]?.color}`}>
                    {statusMap[it.status]?.icon} {statusMap[it.status]?.label}
                  </span>
                  <span className="text-xs text-blue-300/70">Priority: {it.priority}</span>
                  {it.assigned_team && (
                    <span className="text-xs text-blue-300/70">• Team: {it.assigned_team}</span>
                  )}
                </div>
                <h3 className="text-white font-semibold">{it.subject}</h3>
                <p className="text-blue-200/80 text-sm">{it.description}</p>
                <p className="text-blue-300/70 text-xs mt-1">By {it.customer_name} • {it.customer_contact}</p>
                {it.notes?.length > 0 && (
                  <div className="mt-2 border-t border-blue-500/10 pt-2 space-y-1">
                    {it.notes.map((n, idx)=> (
                      <p key={idx} className="text-blue-300/70 text-xs">- {n.text} <span className="opacity-60">({new Date(n.timestamp).toLocaleString()})</span></p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => onAssign(it.id)} className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 text-sm">Assign</button>
                <button onClick={() => onUpdate(it.id, { status: 'complete', note: 'Marked complete' })} className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500 text-sm">Mark Complete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
