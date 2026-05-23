import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialPlans = [
  { id: 1, name: 'Basic', price: '₹999/mo', features: 'Up to 200 students, Basic reports, Email support', popular: false, active: true },
  { id: 2, name: 'Standard', price: '₹2,499/mo', features: 'Up to 500 students, Advanced reports, Phone support, Custom branding', popular: true, active: true },
  { id: 3, name: 'Premium', price: '₹4,999/mo', features: 'Unlimited students, All features, Priority support, API access, Dedicated manager', popular: false, active: true },
]

export default function Plans() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState(initialPlans)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', features: '', popular: false, active: true })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    if (editing) {
      setPlans(plans.map(p => p.id === editing.id ? { ...p, ...form } : p))
      setEditing(null)
    } else {
      setPlans([...plans, { id: Date.now(), ...form }])
    }
    setForm({ name: '', price: '', features: '', popular: false, active: true })
    setShowForm(false)
  }

  const startEdit = (plan) => {
    setEditing(plan)
    setForm({ name: plan.name, price: plan.price, features: plan.features, popular: plan.popular, active: plan.active })
    setShowForm(true)
  }

  const deletePlan = (id) => {
    setPlans(plans.filter(p => p.id !== id))
  }

  const toggleActive = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage available subscription plans for schools</p>
          <button onClick={() => { setShowForm(!showForm); setEditing(null) }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">{showForm ? 'Cancel' : '+ Add Plan'}</button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Name *</label>
                <input type="text" placeholder="e.g. Basic" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</label>
                <input type="text" placeholder="e.g. ₹999/mo" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Features</label>
                <input type="text" placeholder="Comma separated" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">{editing ? 'Update Plan' : 'Create Plan'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm({ name: '', price: '', features: '', popular: false, active: true }) }} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`relative rounded-xl border bg-white dark:bg-gray-800 p-6 transition-shadow hover:shadow-md ${plan.popular ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400' : 'border-gray-200 dark:border-gray-700'}`}>
              {plan.popular && <span className="absolute -top-3 right-4 px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full">Popular</span>}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(plan)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => deletePlan(plan.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.features}</p>
              <button onClick={() => toggleActive(plan.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${plan.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{plan.active ? 'Active' : 'Inactive'}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
