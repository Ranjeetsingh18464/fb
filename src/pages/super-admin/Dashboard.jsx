import { useState } from 'react'

const stats = [
  { label: 'Schools', value: '3', color: 'bg-blue-500' },
  { label: 'Users', value: '1,247', color: 'bg-green-500' },
  { label: 'Revenue', value: '₹45.2L', color: 'bg-purple-500' },
  { label: 'Active', value: '98%', color: 'bg-teal-500' },
]

const recentActivity = [
  { action: 'New school registered', detail: 'Delhi Public School', time: '2 min ago' },
  { action: 'Payment received', detail: '₹2,50,000 from Springfields', time: '15 min ago' },
  { action: 'User flagged', detail: 'Suspicious account - user_4421', time: '1 hr ago' },
  { action: 'System backup', detail: 'Daily backup completed', time: '3 hr ago' },
  { action: 'Ad campaign started', detail: 'Summer Enrollment Drive', time: '5 hr ago' },
  { action: 'New admin added', detail: 'Rohit Sharma - Content Manager', time: '1 day ago' },
]

const initialPlans = [
  { id: 1, name: 'Basic', price: '₹999/mo', features: 'Up to 200 students, Basic reports, Email support', popular: false, active: true },
  { id: 2, name: 'Standard', price: '₹2,499/mo', features: 'Up to 500 students, Advanced reports, Phone support, Custom branding', popular: true, active: true },
  { id: 3, name: 'Premium', price: '₹4,999/mo', features: 'Unlimited students, All features, Priority support, API access, Dedicated manager', popular: false, active: true },
]

export default function Dashboard() {
  const [selectedStat, setSelectedStat] = useState(null)
  const [plans, setPlans] = useState(initialPlans)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm, setPlanForm] = useState({ name: '', price: '', features: '', popular: false, active: true })

  const handlePlanSubmit = (e) => {
    e.preventDefault()
    if (!planForm.name || !planForm.price) return
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...planForm } : p))
      setEditingPlan(null)
    } else {
      setPlans([...plans, { id: Date.now(), ...planForm }])
    }
    setPlanForm({ name: '', price: '', features: '', popular: false, active: true })
    setShowPlanForm(false)
  }

  const startEditPlan = (plan) => {
    setEditingPlan(plan)
    setPlanForm({ name: plan.name, price: plan.price, features: plan.features, popular: plan.popular, active: plan.active })
    setShowPlanForm(true)
  }

  const deletePlan = (id) => {
    setPlans(plans.filter(p => p.id !== id))
  }

  const cancelPlanForm = () => {
    setShowPlanForm(false)
    setEditingPlan(null)
    setPlanForm({ name: '', price: '', features: '', popular: false, active: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Super Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((s) => (
            <button
              key={s.label}
              onClick={() => setSelectedStat(selectedStat === s.label ? null : s.label)}
              className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-left transition ${
                selectedStat === s.label ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{s.value}</p>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription Plans</h2>
            <button onClick={() => { setShowPlanForm(!showPlanForm); setEditingPlan(null) }} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">{showPlanForm ? 'Cancel' : '+ Add Plan'}</button>
          </div>

          {showPlanForm && (
            <form onSubmit={handlePlanSubmit} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-750">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Name *</label>
                  <input type="text" placeholder="e.g. Basic" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</label>
                  <input type="text" placeholder="e.g. ₹999/mo" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Features</label>
                  <input type="text" placeholder="Comma separated" value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={planForm.popular} onChange={e => setPlanForm({ ...planForm, popular: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={planForm.active} onChange={e => setPlanForm({ ...planForm, active: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">{editingPlan ? 'Update' : 'Save'}</button>
                <button type="button" onClick={cancelPlanForm} className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">Cancel</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} className={`rounded-lg border p-4 relative ${plan.popular ? 'border-indigo-400 dark:border-indigo-500 ring-1 ring-indigo-400' : 'border-gray-200 dark:border-gray-700'}`}>
                {plan.popular && <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded-full">Popular</span>}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => startEditPlan(plan)} className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => deletePlan(plan.id)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.price}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{plan.features}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${plan.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{plan.active ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
