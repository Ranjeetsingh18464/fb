import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const initialFeeStructure = [
  { id: 1, class: 'Class 6', tuition: 2500, transport: 800, library: 300, others: 0, total: 3600 },
  { id: 2, class: 'Class 7', tuition: 2700, transport: 800, library: 300, others: 0, total: 3800 },
  { id: 3, class: 'Class 8', tuition: 3000, transport: 1000, library: 350, others: 0, total: 4350 },
  { id: 4, class: 'Class 9', tuition: 3500, transport: 1000, library: 400, others: 0, total: 4900 },
  { id: 5, class: 'Class 10', tuition: 4000, transport: 1200, library: 450, others: 0, total: 5650 }
]

const initialPayments = [
  { id: 1, student: 'Alice Johnson', class: '8A', amount: 3600, date: '2026-04-15', method: 'Online', status: 'paid' },
  { id: 2, student: 'Bob Williams', class: '8A', amount: 3600, date: '2026-04-10', method: 'Cash', status: 'paid' },
  { id: 3, student: 'Charlie Brown', class: '8B', amount: 1800, date: '2026-04-05', method: 'Cheque', status: 'partial' },
  { id: 4, student: 'Diana Davis', class: '7A', amount: 3800, date: '2026-04-12', method: 'Online', status: 'paid' },
  { id: 5, student: 'Eve Wilson', class: '7B', amount: 0, date: '-', method: '-', status: 'pending' },
  { id: 6, student: 'Frank Miller', class: '9A', amount: 4900, date: '2026-04-14', method: 'Online', status: 'paid' }
]

export default function Fees() {
  const navigate = useNavigate()
  const [feeStructure, setFeeStructure] = useState(initialFeeStructure)
  const [payments, setPayments] = useState(initialPayments)
  const [showFeeForm, setShowFeeForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editFeeId, setEditFeeId] = useState(null)
  const [editPaymentId, setEditPaymentId] = useState(null)
  const [viewPayment, setViewPayment] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [feeForm, setFeeForm] = useState({ class: '', tuition: '', transport: '', library: '', others: '' })
  const [paymentForm, setPaymentForm] = useState({ student: '', class: '', amount: '', date: '', method: 'Online', status: 'paid' })

  const resetFeeForm = () => setFeeForm({ class: '', tuition: '', transport: '', library: '', others: '' })
  const resetPaymentForm = () => setPaymentForm({ student: '', class: '', amount: '', date: '', method: 'Online', status: 'paid' })

  const handleFeeSubmit = () => {
    if (!feeForm.class) return
    const t = Number(feeForm.tuition) || 0, tr = Number(feeForm.transport) || 0, l = Number(feeForm.library) || 0, o = Number(feeForm.others) || 0
    if (editFeeId) {
      setFeeStructure(feeStructure.map(f => f.id === editFeeId ? { ...f, class: feeForm.class, tuition: t, transport: tr, library: l, others: o, total: t + tr + l + o } : f))
      setEditFeeId(null)
    } else {
      setFeeStructure([...feeStructure, { id: Date.now(), class: feeForm.class, tuition: t, transport: tr, library: l, others: o, total: t + tr + l + o }])
    }
    resetFeeForm(); setShowFeeForm(false)
  }

  const handlePaymentSubmit = () => {
    if (!paymentForm.student) return
    if (editPaymentId) {
      setPayments(payments.map(p => p.id === editPaymentId ? { ...p, ...paymentForm, amount: Number(paymentForm.amount) } : p))
      setEditPaymentId(null)
    } else {
      setPayments([...payments, { id: Date.now(), ...paymentForm, amount: Number(paymentForm.amount) }])
    }
    resetPaymentForm(); setShowPaymentForm(false)
  }

  const handleEditFee = (f) => {
    setEditFeeId(f.id); setFeeForm({ class: f.class, tuition: String(f.tuition), transport: String(f.transport), library: String(f.library), others: String(f.others) }); setShowFeeForm(true)
  }

  const handleEditPayment = (p) => {
    setEditPaymentId(p.id); setPaymentForm({ student: p.student, class: p.class, amount: String(p.amount), date: p.date, method: p.method, status: p.status }); setShowPaymentForm(true)
  }

  const statusBadge = (status) => {
    if (status === 'paid') return <span className="badge-success">Paid</span>
    if (status === 'partial') return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full">Partial</span>
    return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-full">Pending</span>
  }

  const stats = [
    { label: 'Total Collected', value: '$48,250', change: '+12%', color: 'bg-green-500' },
    { label: 'Pending Amount', value: '$12,400', change: '-5%', color: 'bg-orange-500' },
    { label: 'Due This Month', value: '$6,800', change: '8 students', color: 'bg-red-500' },
    { label: 'Collection Rate', value: '79%', change: '+3%', color: 'bg-blue-500' }
  ]

  const filteredPayments = statusFilter ? payments.filter(p => p.status === statusFilter) : payments

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
            <h1 className="page-title">Fee Management</h1>
            <p className="page-subtitle">Track fees, dues, and payment history</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-lg text-white`}>$</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs font-medium text-green-600">{s.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <button onClick={() => { setShowFeeForm(!showFeeForm); if (!showFeeForm) { setEditFeeId(null); resetFeeForm() } }} className="btn-primary">➕ Add Fee Structure</button>
        <button onClick={() => { setShowPaymentForm(!showPaymentForm); if (!showPaymentForm) { setEditPaymentId(null); resetPaymentForm() } }} className="btn-outline">➕ Record Payment</button>
        <button onClick={() => alert('Fee report generated!')} className="btn-outline">💰 Generate Fee Report</button>
      </div>

      {showFeeForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editFeeId ? 'Edit Fee Structure' : 'New Fee Structure'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={feeForm.class} onChange={e => setFeeForm({ ...feeForm, class: e.target.value })} className="input-field" placeholder="Class name" />
          <input type="number" value={feeForm.tuition} onChange={e => setFeeForm({ ...feeForm, tuition: e.target.value })} className="input-field" placeholder="Tuition fee" />
          <input type="number" value={feeForm.transport} onChange={e => setFeeForm({ ...feeForm, transport: e.target.value })} className="input-field" placeholder="Transport fee" />
          <input type="number" value={feeForm.library} onChange={e => setFeeForm({ ...feeForm, library: e.target.value })} className="input-field" placeholder="Library fee" />
          <input type="number" value={feeForm.others} onChange={e => setFeeForm({ ...feeForm, others: e.target.value })} className="input-field" placeholder="Others" />
        </div>
        <button onClick={handleFeeSubmit} className="btn-primary mt-3">{editFeeId ? 'Update' : 'Add'} Fee Structure</button>
        <button onClick={() => { setShowFeeForm(false); setEditFeeId(null); resetFeeForm() }} className="btn-outline ml-2 mt-3">Cancel</button>
      </div>}

      {showPaymentForm && <div className="card mb-6 p-4">
        <h3 className="font-semibold mb-4">{editPaymentId ? 'Edit Payment' : 'Record Payment'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={paymentForm.student} onChange={e => setPaymentForm({ ...paymentForm, student: e.target.value })} className="input-field" placeholder="Student name" />
          <input value={paymentForm.class} onChange={e => setPaymentForm({ ...paymentForm, class: e.target.value })} className="input-field" placeholder="Class" />
          <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} className="input-field" placeholder="Amount" />
          <input type="date" value={paymentForm.date} onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })} className="input-field" />
          <select value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })} className="input-field">
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>
          <select value={paymentForm.status} onChange={e => setPaymentForm({ ...paymentForm, status: e.target.value })} className="input-field">
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button onClick={handlePaymentSubmit} className="btn-primary mt-3">{editPaymentId ? 'Update' : 'Record'} Payment</button>
        <button onClick={() => { setShowPaymentForm(false); setEditPaymentId(null); resetPaymentForm() }} className="btn-outline ml-2 mt-3">Cancel</button>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold mb-4">Fee Structure</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Tuition</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Transport</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Library</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Others</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Total</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((f) => (
                  <tr key={f.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{f.class}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{f.tuition}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{f.transport}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{f.library}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{f.others}</td>
                    <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">{f.total}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEditFee(f)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">Edit</button>
                      <button onClick={() => { if (confirm('Delete this fee structure?')) setFeeStructure(feeStructure.filter(x => x.id !== f.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Payment History</h3>
            <select className="input-field w-auto text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-right py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{p.student}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{p.class}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{p.amount}</td>
                    <td className="py-3 text-right text-gray-500 dark:text-gray-400 text-xs">{p.date}</td>
                    <td className="py-3 text-right">{statusBadge(p.status)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => setViewPayment(p)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">View</button>
                      <button onClick={() => handleEditPayment(p)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">Edit</button>
                      <button onClick={() => { if (confirm('Delete this payment record?')) setPayments(payments.filter(x => x.id !== p.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewPayment && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewPayment(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewPayment.student}</h3>
            <button onClick={() => setViewPayment(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Class:</span> {viewPayment.class}</p>
            <p><span className="font-medium">Amount:</span> ${viewPayment.amount}</p>
            <p><span className="font-medium">Date:</span> {viewPayment.date}</p>
            <p><span className="font-medium">Method:</span> {viewPayment.method}</p>
            <p><span className="font-medium">Status:</span> {statusBadge(viewPayment.status)}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
