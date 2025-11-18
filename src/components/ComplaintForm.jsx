import { useState } from 'react'

export default function ComplaintForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_contact: '',
    address: '',
    subject: '',
    description: '',
    priority: 'normal'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-blue-500/20 rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">New Complaint</h3>
          <button onClick={onClose} className="text-blue-200 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="bg-slate-700/70 text-white rounded p-2" placeholder="Customer name" name="customer_name" value={form.customer_name} onChange={handleChange} required />
            <input className="bg-slate-700/70 text-white rounded p-2" placeholder="Contact (email/phone)" name="customer_contact" value={form.customer_contact} onChange={handleChange} required />
          </div>
          <input className="bg-slate-700/70 text-white rounded p-2 w-full" placeholder="Address" name="address" value={form.address} onChange={handleChange} />
          <input className="bg-slate-700/70 text-white rounded p-2 w-full" placeholder="Subject" name="subject" value={form.subject} onChange={handleChange} required />
          <textarea className="bg-slate-700/70 text-white rounded p-2 w-full" placeholder="Description" name="description" rows={4} value={form.description} onChange={handleChange} required />
          <div className="flex items-center gap-3">
            <label className="text-blue-200/80 text-sm">Priority</label>
            <select className="bg-slate-700/70 text-white rounded p-2" name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-slate-700/70 text-blue-100 hover:bg-slate-700">Cancel</button>
            <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}
