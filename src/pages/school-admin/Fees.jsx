import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where, Timestamp } from '../../services/firebase'

const statusColor = {
  Paid: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
  Pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
  Overdue: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900'
}

const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Fees() {
  const navigate = useNavigate()
  const [structures, setStructures] = useState([])
  const [students, setStudents] = useState([])
  const [feeRecords, setFeeRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const [editStruct, setEditStruct] = useState(null)
  const [structForm, setStructForm] = useState({ grade: 'Class 1', tuition: '', transport: '', library: '', others: '' })
  const [showStructForm, setShowStructForm] = useState(false)

  const [submitModal, setSubmitModal] = useState(null)
  const [submitForm, setSubmitForm] = useState({ amount: '', method: 'Cash', note: '' })

  const [quickStudent, setQuickStudent] = useState(null)
  const [quickSearch, setQuickSearch] = useState('')
  const [quickShowDropdown, setQuickShowDropdown] = useState(false)
  const [quickFilterGrade, setQuickFilterGrade] = useState('All')
  const [quickFilterSection, setQuickFilterSection] = useState('All')
  const [quickAmount, setQuickAmount] = useState('')
  const [quickMethod, setQuickMethod] = useState('Cash')
  const [quickMsg, setQuickMsg] = useState('')

  const [feeFilterGrade, setFeeFilterGrade] = useState('')
  const [feeFilterSection, setFeeFilterSection] = useState('')
  const [feeFilterName, setFeeFilterName] = useState('')

  const filteredStudents = students.filter(s => {
    if (feeFilterGrade && s.grade !== feeFilterGrade) return false
    if (feeFilterSection && s.section !== feeFilterSection) return false
    if (feeFilterName && !s.name.toLowerCase().includes(feeFilterName.toLowerCase())) return false
    return true
  })

  const [reportGrade, setReportGrade] = useState('All Grades')
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString())
  const [reportMonth, setReportMonth] = useState('Full Year')
  const [reportFilterName, setReportFilterName] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [structSnap, studentSnap, feeSnap] = await Promise.all([
        getDocs(collection(db, 'feeStructures')),
        getDocs(collection(db, 'students')),
        getDocs(collection(db, 'feeRecords'))
      ])
      const sList = []
      structSnap.forEach(d => sList.push({ id: d.id, ...d.data() }))
      setStructures(sList)

      const stuList = []
      studentSnap.forEach(d => stuList.push({ id: d.id, ...d.data() }))
      setStudents(stuList)

      const feeList = []
      feeSnap.forEach(d => feeList.push({ id: d.id, ...d.data() }))
      setFeeRecords(feeList)
    } catch (err) {
      console.error('Failed to load fee data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFeeForGrade = (grade) => {
    const s = structures.find(st => st.grade === grade)
    if (!s) return 0
    return (s.tuition || 0) + (s.transport || 0) + (s.library || 0) + (s.others || 0)
  }

  const openEditStruct = (s) => {
    setEditStruct(s.id)
    setStructForm({ grade: s.grade, tuition: s.tuition.toString(), transport: s.transport.toString(), library: s.library.toString(), others: s.others.toString() })
    setShowStructForm(true)
  }

  const saveStruct = async () => {
    const data = {
      grade: structForm.grade,
      tuition: Number(structForm.tuition) || 0,
      transport: Number(structForm.transport) || 0,
      library: Number(structForm.library) || 0,
      others: Number(structForm.others) || 0
    }
    try {
      if (editStruct) {
        await updateDoc(doc(db, 'feeStructures', editStruct), data)
        setStructures(structures.map(s => s.id === editStruct ? { ...s, ...data } : s))
      } else {
        const id = doc(collection(db, 'feeStructures')).id
        await setDoc(doc(db, 'feeStructures', id), data)
        setStructures([...structures, { id, ...data }])
      }
    } catch (err) {
      console.error('Failed to save fee structure:', err)
    }
    setEditStruct(null)
    setShowStructForm(false)
    setStructForm({ grade: '1st Grade', tuition: '', transport: '', library: '', others: '' })
  }

  const deleteStruct = async (id) => {
    try {
      await deleteDoc(doc(db, 'feeStructures', id))
      setStructures(structures.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete fee structure:', err)
    }
  }

  const getStudentFeeRecord = (student) => {
    const rec = feeRecords.find(r => r.studentId === student.id)
    if (rec) return rec
    const total = getFeeForGrade(student.grade)
    return { studentId: student.id, studentName: student.name, grade: student.grade, section: student.section, parent: student.parent || '—', totalFees: total, paidAmount: 0, pendingAmount: total, status: total > 0 ? 'Pending' : '—', lastPaymentDate: null, paymentHistory: [] }
  }

  const openSubmitModal = (student) => {
    setSubmitModal(student)
    setSubmitForm({ amount: '', method: 'Cash', note: '' })
  }

  const submitFee = async () => {
    if (!submitModal || !submitForm.amount) return
    const student = submitModal
    const amount = Number(submitForm.amount)
    if (!amount || amount <= 0) return

    try {
      const existing = feeRecords.find(r => r.studentId === student.id)
      const total = getFeeForGrade(student.grade)
      const payment = { amount, date: Timestamp.now(), method: submitForm.method, note: submitForm.note }

      if (existing) {
        const newPaid = (existing.paidAmount || 0) + amount
        const newPending = Math.max(0, total - newPaid)
        const newStatus = newPending <= 0 ? 'Paid' : newPaid > 0 ? 'Pending' : 'Overdue'
        const history = [...(existing.paymentHistory || []), payment]
        await updateDoc(doc(db, 'feeRecords', existing.id), {
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newStatus,
          lastPaymentDate: Timestamp.now(),
          paymentHistory: history
        })
        setFeeRecords(feeRecords.map(r => r.id === existing.id ? { ...r, paidAmount: newPaid, pendingAmount: newPending, status: newStatus, lastPaymentDate: Timestamp.now(), paymentHistory: history } : r))
      } else {
        const id = doc(collection(db, 'feeRecords')).id
        const newRecord = {
          studentId: student.id,
          studentName: student.name,
          grade: student.grade,
          section: student.section,
          parent: student.parent || '—',
          totalFees: total,
          paidAmount: amount,
          pendingAmount: Math.max(0, total - amount),
          status: amount >= total ? 'Paid' : 'Pending',
          lastPaymentDate: Timestamp.now(),
          paymentHistory: [payment]
        }
        await setDoc(doc(db, 'feeRecords', id), newRecord)
        setFeeRecords([...feeRecords, { id, ...newRecord }])
      }
    } catch (err) {
      console.error('Failed to submit fee:', err)
    }
    setSubmitModal(null)
    setSubmitForm({ amount: '', method: 'Cash', note: '' })
  }

  const handleQuickFee = async () => {
    if (!quickStudent || !quickAmount) return
    const amount = Number(quickAmount)
    if (!amount || amount <= 0) return

    try {
      const existing = feeRecords.find(r => r.studentId === quickStudent.id)
      const total = getFeeForGrade(quickStudent.grade)
      const payment = { amount, date: Timestamp.now(), method: quickMethod, note: 'Quick collection' }

      if (existing) {
        const newPaid = (existing.paidAmount || 0) + amount
        const newPending = Math.max(0, total - newPaid)
        const newStatus = newPending <= 0 ? 'Paid' : newPaid > 0 ? 'Pending' : 'Overdue'
        const history = [...(existing.paymentHistory || []), payment]
        await updateDoc(doc(db, 'feeRecords', existing.id), {
          paidAmount: newPaid, pendingAmount: newPending, status: newStatus,
          lastPaymentDate: Timestamp.now(), paymentHistory: history
        })
        setFeeRecords(feeRecords.map(r => r.id === existing.id ? { ...r, paidAmount: newPaid, pendingAmount: newPending, status: newStatus, lastPaymentDate: Timestamp.now(), paymentHistory: history } : r))
      } else {
        const id = doc(collection(db, 'feeRecords')).id
        const newRecord = {
          studentId: quickStudent.id, studentName: quickStudent.name, grade: quickStudent.grade,
          section: quickStudent.section, parent: quickStudent.parent || '—', totalFees: total,
          paidAmount: amount, pendingAmount: Math.max(0, total - amount),
          status: amount >= total ? 'Paid' : 'Pending', lastPaymentDate: Timestamp.now(), paymentHistory: [payment]
        }
        await setDoc(doc(db, 'feeRecords', id), newRecord)
        setFeeRecords([...feeRecords, { id, ...newRecord }])
      }
      setQuickMsg(`₹${amount} collected from ${quickStudent.name}`)
    } catch (err) {
      console.error('Failed to take fee:', err)
      setQuickMsg('Failed to process payment')
    }
    setQuickAmount('')
    setQuickMethod('Cash')
    setTimeout(() => setQuickMsg(''), 3000)
  }

  const getReportRecords = () => {
    let list = students.map(s => getStudentFeeRecord(s))
    if (reportGrade !== 'All Grades') list = list.filter(r => r.grade === reportGrade)
    if (reportMonth !== 'Full Year') {
      const monthIdx = months.indexOf(reportMonth)
      list = list.map(r => {
        const paymentsInMonth = (r.paymentHistory || []).filter(p => {
          if (!p.date) return false
          const d = p.date.toDate ? p.date.toDate() : new Date(p.date)
          return d.getMonth() === monthIdx && d.getFullYear() === parseInt(reportYear)
        })
        const monthPaid = paymentsInMonth.reduce((s, p) => s + (p.amount || 0), 0)
        return { ...r, monthPaid }
      })
    }
    return list
  }

  const getMonthlyData = () => {
    return months.map((m, idx) => {
      let total = 0
      feeRecords.forEach(r => {
        ;(r.paymentHistory || []).forEach(p => {
          if (!p.date) return
          const d = p.date.toDate ? p.date.toDate() : new Date(p.date)
          if (d.getMonth() === idx && d.getFullYear() === parseInt(reportYear)) {
            if (reportGrade === 'All Grades' || r.grade === reportGrade) total += (p.amount || 0)
          }
        })
      })
      return { month: m, total }
    })
  }

  const reportRecords = getReportRecords()
  const filteredReportRecords = reportRecords.filter(r => {
    if (reportFilterName && !r.studentName?.toLowerCase().includes(reportFilterName.toLowerCase())) return false
    return true
  })
  const monthlyData = getMonthlyData()
  const totalStudents = filteredReportRecords.length
  const totalCollected = filteredReportRecords.reduce((s, r) => s + (r.monthPaid !== undefined ? r.monthPaid : r.paidAmount || 0), 0)
  const totalPending = filteredReportRecords.reduce((s, r) => s + (r.pendingAmount || 0), 0)
  const avgStudent = totalStudents > 0 ? Math.round(totalCollected / totalStudents) : 0
  const quickFiltered = (() => {
    let list = students
    if (quickFilterGrade !== 'All') list = list.filter(s => s.grade === quickFilterGrade)
    if (quickFilterSection !== 'All') list = list.filter(s => s.section === quickFilterSection)
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q) || (s.studentId || '').toLowerCase().includes(q))
    }
    return list.slice(0, 20)
  })()

  const exportCSV = () => {
    const headers = ['Student ID', 'Name', 'Grade', 'Parent', 'Total Paid', 'Total Pending', 'Total Fees', 'Status', 'Last Payment']
    const rows = filteredReportRecords.map(r => {
      const s = students.find(st => st.id === r.studentId)
      return [
        s?.studentId || r.studentId,
        r.studentName,
        r.grade,
        r.parent,
        r.paidAmount || 0,
        r.pendingAmount || 0,
        r.totalFees || 0,
        r.status,
        r.lastPaymentDate ? (r.lastPaymentDate.toDate ? r.lastPaymentDate.toDate().toLocaleDateString() : '—') : '—'
      ]
    })
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fee_report_${reportGrade}_${reportYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">&larr; Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Fees Management</h1>
        </div>

        <div className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Fee Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade</label>
              <select value={quickFilterGrade} onChange={e => { setQuickFilterGrade(e.target.value); setQuickStudent(null); setQuickSearch(''); setQuickMsg('') }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="All">All Grades</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section</label>
              <select value={quickFilterSection} onChange={e => { setQuickFilterSection(e.target.value); setQuickStudent(null); setQuickSearch(''); setQuickMsg('') }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="All">All Sections</option>
                {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="relative md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search Student</label>
              <input
                type="text"
                placeholder="Type name or ID..."
                value={quickStudent ? `${quickStudent.name} (${quickStudent.studentId || '—'})` : quickSearch}
                onChange={e => { setQuickSearch(e.target.value); setQuickStudent(null); setQuickShowDropdown(true) }}
                onFocus={() => setQuickShowDropdown(true)}
                onBlur={() => setTimeout(() => setQuickShowDropdown(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              {quickShowDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {quickFiltered.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No students found</div>
                  ) : quickFiltered.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={() => { setQuickStudent(s); setQuickSearch(''); setQuickShowDropdown(false); setQuickAmount(''); setQuickMsg('') }}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{s.name}</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>ID: {s.studentId || '—'}</span>
                        <span>Grade: {s.grade}</span>
                        <span>Sec: {s.section}</span>
                        <span>Parent: {s.parent || '—'}</span>
                        <span>Phone: {s.phone || '—'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {quickStudent && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 mb-3">
              <span className="text-gray-900 dark:text-white font-medium">{quickStudent.name}</span>
              <span className="text-gray-500 dark:text-gray-400">ID: <span className="text-gray-700 dark:text-gray-300">{quickStudent.studentId || '—'}</span></span>
              <span className="text-gray-500 dark:text-gray-400">Grade: <span className="text-gray-700 dark:text-gray-300">{quickStudent.grade}</span></span>
              <span className="text-gray-500 dark:text-gray-400">Sec: <span className="text-gray-700 dark:text-gray-300">{quickStudent.section}</span></span>
              <span className="text-gray-500 dark:text-gray-400">Parent: <span className="text-gray-700 dark:text-gray-300">{quickStudent.parent || '—'}</span></span>
              <span className="text-gray-500 dark:text-gray-400">Phone: <span className="text-gray-700 dark:text-gray-300">{quickStudent.phone || '—'}</span></span>
              <span className="text-gray-500 dark:text-gray-400">Due: <span className="text-red-600 dark:text-red-400 font-semibold">₹{getStudentFeeRecord(quickStudent).pendingAmount.toLocaleString()}</span></span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount (₹)</label>
              <input type="number" placeholder="Enter amount" value={quickAmount} onChange={e => setQuickAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Method</label>
              <select value={quickMethod} onChange={e => setQuickMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
                <option>Online</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleQuickFee} disabled={!quickStudent || !quickAmount || Number(quickAmount) <= 0} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50 font-medium">Take Fee</button>
            </div>
          </div>
          {quickMsg && (
            <div className="mt-2 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded-lg px-4 py-2">{quickMsg}</div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fee Structure</h2>
            <button onClick={() => { setEditStruct(null); setStructForm({ grade: 'Class 1', tuition: '', transport: '', library: '', others: '' }); setShowStructForm(true) }} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">+ Add Structure</button>
          </div>
          {structures.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No fee structures defined. Add one to get started.</p>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Class</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Tuition</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Transport</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Library</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Others</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Total</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {structures.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.grade}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{(s.tuition || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{(s.transport || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{(s.library || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{(s.others || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">₹{((s.tuition || 0) + (s.transport || 0) + (s.library || 0) + (s.others || 0)).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditStruct(s)} className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition">Edit</button>
                        <button onClick={() => deleteStruct(s.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {showStructForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowStructForm(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editStruct ? 'Edit' : 'Add'} Fee Structure</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                  <select value={structForm.grade} onChange={e => setStructForm({ ...structForm, grade: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                {['tuition', 'transport', 'library', 'others'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{field}</label>
                    <input type="number" placeholder={field} value={structForm[field]} onChange={e => setStructForm({ ...structForm, [field]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={saveStruct} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">Save</button>
                <button onClick={() => { setShowStructForm(false); setEditStruct(null) }} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Fee Records</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={feeFilterGrade} onChange={e => setFeeFilterGrade(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">All Grades</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={feeFilterSection} onChange={e => setFeeFilterSection(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">All Sections</option>
              {['A','B','C','D','E'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input value={feeFilterName} onChange={e => setFeeFilterName(e.target.value)} placeholder="Search by name..." className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 flex-1 min-w-[160px]" />
          </div>
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No students match the filters.</p>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Student ID</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Name</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Grade</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Parent</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Paid</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Pending</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Fees</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Last Payment</th>
                  <th className="text-right px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const rec = getStudentFeeRecord(student)
                  return (
                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">{student.studentId || '—'}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-white font-medium whitespace-nowrap">{student.name}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{student.grade} {student.section}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{student.parent || '—'}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">₹{(rec.paidAmount || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">₹{(rec.pendingAmount || 0).toLocaleString()}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-white font-medium">₹{(rec.totalFees || 0).toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${rec.status === 'Paid' ? statusColor.Paid : rec.status === 'Overdue' ? statusColor.Overdue : statusColor.Pending}`}>{rec.status}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                        {rec.lastPaymentDate ? (rec.lastPaymentDate.toDate ? rec.lastPaymentDate.toDate().toLocaleDateString() : '—') : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => openSubmitModal(student)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition font-medium">Take Fee</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {submitModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSubmitModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Take Fee</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div><span className="text-gray-500 dark:text-gray-400">Student ID:</span> <span className="text-gray-900 dark:text-white font-medium">{submitModal.studentId || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white font-medium">{submitModal.name}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Grade:</span> <span className="text-gray-900 dark:text-white">{submitModal.grade} {submitModal.section}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Parent:</span> <span className="text-gray-900 dark:text-white">{submitModal.parent || '—'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Total Paid:</span> <span className="text-green-600 dark:text-green-400 font-semibold">₹{getStudentFeeRecord(submitModal).paidAmount.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Total Pending:</span> <span className="text-red-600 dark:text-red-400 font-semibold">₹{getStudentFeeRecord(submitModal).pendingAmount.toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Total Fees:</span> <span className="text-gray-900 dark:text-white font-semibold">₹{getFeeForGrade(submitModal.grade).toLocaleString()}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStudentFeeRecord(submitModal).status === 'Paid' ? statusColor.Paid : getStudentFeeRecord(submitModal).status === 'Overdue' ? statusColor.Overdue : statusColor.Pending}`}>{getStudentFeeRecord(submitModal).status}</span></div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
                  <input type="number" placeholder="Enter amount" value={submitForm.amount} onChange={e => setSubmitForm({ ...submitForm, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <select value={submitForm.method} onChange={e => setSubmitForm({ ...submitForm, method: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (optional)</label>
                  <input placeholder="Payment note" value={submitForm.note} onChange={e => setSubmitForm({ ...submitForm, note: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={submitFee} disabled={!submitForm.amount || Number(submitForm.amount) <= 0} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50 font-medium">Confirm Payment</button>
                <button onClick={() => setSubmitModal(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fee Collection Report</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Generate month-wise fee reports by grade</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grade</label>
              <select value={reportGrade} onChange={e => setReportGrade(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option>All Grades</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year</label>
              <select value={reportYear} onChange={e => setReportYear(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {[2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Month</label>
              <select value={reportMonth} onChange={e => setReportMonth(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option>Full Year</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search</label>
              <input value={reportFilterName} onChange={e => setReportFilterName(e.target.value)} placeholder="Search by name..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Students', value: totalStudents },
              { label: 'Total Collected', value: `₹${totalCollected.toLocaleString()}` },
              { label: 'Total Pending', value: `₹${totalPending.toLocaleString()}` },
              { label: 'Avg per Student', value: `₹${avgStudent.toLocaleString()}` }
            ].map(stat => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">Export CSV</button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition">Print</button>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Student ID</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Name</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Grade</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Parent</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Paid</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Pending</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Fees</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Last Payment</th>
                  <th className="text-right px-3 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReportRecords.length === 0 ? (
                  <tr><td colSpan="10" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No records found</td></tr>
                ) : filteredReportRecords.map(r => {
                  const student = students.find(s => s.id === r.studentId)
                  return (
                  <tr key={r.studentId || r.studentName} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">{student?.studentId || r.studentId || '—'}</td>
                    <td className="px-3 py-3 text-gray-900 dark:text-white font-medium whitespace-nowrap">{r.studentName}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.grade}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.parent || '—'}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">₹{((r.monthPaid !== undefined ? r.monthPaid : r.paidAmount) || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">₹{(r.pendingAmount || 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-900 dark:text-white font-medium">₹{(r.totalFees || 0).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${r.status === 'Paid' ? statusColor.Paid : r.status === 'Overdue' ? statusColor.Overdue : statusColor.Pending}`}>{r.status}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                      {r.lastPaymentDate ? (r.lastPaymentDate.toDate ? r.lastPaymentDate.toDate().toLocaleDateString() : '—') : '—'}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {student && (
                        <button onClick={() => openSubmitModal(student)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition font-medium">Take Fee</button>
                      )}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Monthly Collection</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {monthlyData.map(m => (
              <div key={m.month} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.month}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{m.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
