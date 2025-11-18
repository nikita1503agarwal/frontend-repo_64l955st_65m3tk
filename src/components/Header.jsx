import { Bell, PlusCircle, RefreshCw } from 'lucide-react'

export default function Header({ onNew, onRefresh, notifCount }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Internet Complaint Register</h1>
        <p className="text-blue-200/80 text-sm">Track issues from report to resolution</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onRefresh} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/70 text-blue-100 hover:bg-slate-700 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
        <button onClick={onNew} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition">
          <PlusCircle className="w-4 h-4" /> New Complaint
        </button>
        <div className="relative">
          <div className="p-2 rounded-full bg-slate-700/70 text-blue-100">
            <Bell className="w-5 h-5" />
          </div>
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1.5 rounded-full">
              {notifCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
