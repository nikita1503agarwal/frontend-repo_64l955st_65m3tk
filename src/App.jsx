import { useEffect, useState } from 'react'
import Header from './components/Header'
import ComplaintForm from './components/ComplaintForm'
import ComplaintList from './components/ComplaintList'

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [showForm, setShowForm] = useState(false)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/notifications?user_id=admin&unread_only=true`)
      const data = await res.json()
      setNotifications(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const createComplaint = async (payload) => {
    const res = await fetch(`${backendUrl}/api/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      alert('Failed to create complaint')
      return
    }
    setShowForm(false)
  }

  const assignTeam = async (id) => {
    const team = prompt('Assign to team (e.g., field-team, support)')
    if (!team) return
    await fetch(`${backendUrl}/api/complaints/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team })
    })
  }

  const updateComplaint = async (id, changes) => {
    await fetch(`${backendUrl}/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    })
  }

  const markNotifRead = async (id) => {
    await fetch(`${backendUrl}/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true })
    })
    fetchNotifications()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen p-6 max-w-6xl mx-auto">
        <Header onNew={() => setShowForm(true)} onRefresh={fetchNotifications} notifCount={notifications.length} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ComplaintList backendUrl={backendUrl} onAssign={assignTeam} onUpdate={updateComplaint} />
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4">
            <h3 className="text-white font-semibold mb-3">Notifications</h3>
            {notifications.length === 0 && (
              <p className="text-blue-200/80 text-sm">No new notifications</p>
            )}
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="bg-slate-800/60 border border-blue-500/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{n.title}</p>
                    <button onClick={() => markNotifRead(n.id)} className="text-xs text-blue-300 hover:text-white">Mark read</button>
                  </div>
                  <p className="text-blue-200/80 text-xs">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <ComplaintForm onClose={() => setShowForm(false)} onSubmit={createComplaint} />
      )}
    </div>
  )
}

export default App
