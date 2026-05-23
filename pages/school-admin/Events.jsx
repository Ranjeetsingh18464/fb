import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialEvents = [
  { id: 1, name: 'Annual Sports Day', date: '2026-06-15', description: 'Inter-class sports competitions including athletics, football, and basketball.', status: 'upcoming', category: 'Sports' },
  { id: 2, name: 'Science Exhibition', date: '2026-06-20', description: 'Students showcase science projects and innovations.', status: 'upcoming', category: 'Academic' },
  { id: 3, name: 'Parent-Teacher Meeting', date: '2026-05-25', description: 'Quarterly meeting to discuss student progress.', status: 'upcoming', category: 'Meeting' },
  { id: 4, name: 'Summer Break', date: '2026-07-01', description: 'School closed for summer vacation.', status: 'upcoming', category: 'Holiday' },
  { id: 5, name: 'Annual Day Celebration', date: '2026-04-10', description: 'Cultural programs and award ceremony.', status: 'completed', category: 'Cultural' },
  { id: 6, name: 'Earth Day Event', date: '2026-04-22', description: 'Tree planting and environmental awareness activities.', status: 'completed', category: 'Cultural' },
  { id: 7, name: 'Math Olympiad', date: '2026-05-10', description: 'Inter-school mathematics competition.', status: 'ongoing', category: 'Academic' }
]

export default function Events() {
  const navigate = useNavigate()
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [viewEvent, setViewEvent] = useState(null)
  const [form, setForm] = useState({ name: '', date: '', description: '', status: 'upcoming', category: '' })

  const resetForm = () => setForm({ name: '', date: '', description: '', status: 'upcoming', category: '' })

  const handleSubmit = () => {
    if (!form.name || !form.date) return
    if (editId) {
      setEvents(events.map(e => e.id === editId ? { ...e, ...form } : e))
      setEditId(null)
    } else {
      setEvents([...events, { id: Date.now(), ...form }])
    }
    resetForm(); setShowForm(false)
  }

  const handleEdit = (e) => {
    setEditId(e.id); setForm({ name: e.name, date: e.date, description: e.description, status: e.status, category: e.category }); setShowForm(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming': return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">Upcoming</span>
      case 'ongoing': return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">Ongoing</span>
      case 'completed': return <span className="bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">Completed</span>
      default: return null
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/school_admin')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="page-title">Events</h1>
            <p className="page-subtitle">Manage school events and calendar</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditId(null); resetForm() } }} className="btn-primary">➕ Add Event</button>
        {showForm && <button onClick={() => { setShowForm(false); setEditId(null); resetForm() }} className="btn-outline">Cancel</button>}
      </div>

      {showForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editId ? 'Edit Event' : 'New Event'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Event name" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
            <option value="">Select category</option>
            <option value="Sports">Sports</option>
            <option value="Academic">Academic</option>
            <option value="Cultural">Cultural</option>
            <option value="Meeting">Meeting</option>
            <option value="Holiday">Holiday</option>
          </select>
          <div className="md:col-span-3">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field w-full" placeholder="Description" rows={2} />
          </div>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn-primary mt-3">{editId ? 'Update' : 'Add'} Event</button>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => e.status !== 'completed').map((e) => (
              <div key={e.id} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex flex-col items-center justify-center text-xs font-bold text-primary-600">
                      <span className="text-lg leading-none">{new Date(e.date).getDate()}</span>
                      <span>{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{e.name}</h3>
                        <button onClick={() => setViewEvent(e)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{e.category}</span>
                    </div>
                  </div>
                  {getStatusBadge(e.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{e.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 dark:text-gray-500">📅 {e.date}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setViewEvent(e)} className="text-blue-600 dark:text-blue-400 hover:underline">View</button>
                    <button onClick={() => handleEdit(e)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => { if (confirm('Delete this event?')) setEvents(events.filter(x => x.id !== e.id)) }} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">This Month</h3>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">May 2026</p>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="font-medium text-gray-400 dark:text-gray-500 py-1">{d}</span>)}
          </div>
          {[...Array(5)].map((_, w) => (
            <div key={w} className="grid grid-cols-7 gap-1 text-center text-xs">
              {[...Array(7)].map((_, d) => {
                const day = w * 7 + d + 1
                const hasEvent = events.some(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === 4)
                return (
                  <div key={d} className={`py-1.5 rounded ${hasEvent ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {day <= 31 ? day : ''}
                  </div>
                )
              })}
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span> {events.filter(e => e.status !== 'completed').length} events this month
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Event History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Event Name</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Description</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{e.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{e.date}</td>
                  <td className="py-3"><span className="text-xs bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{e.category}</span></td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate">{e.description}</td>
                  <td className="py-3 text-right">{getStatusBadge(e.status)}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => setViewEvent(e)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">View</button>
                    <button onClick={() => handleEdit(e)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">Edit</button>
                    <button onClick={() => { if (confirm('Delete this event?')) setEvents(events.filter(x => x.id !== e.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewEvent && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewEvent(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewEvent.name}</h3>
            <button onClick={() => setViewEvent(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Date:</span> {viewEvent.date}</p>
            <p><span className="font-medium">Category:</span> {viewEvent.category}</p>
            <p><span className="font-medium">Status:</span> {getStatusBadge(viewEvent.status)}</p>
            <p><span className="font-medium">Description:</span></p>
            <p className="text-gray-600 dark:text-gray-400">{viewEvent.description}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
