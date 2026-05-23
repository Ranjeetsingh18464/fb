import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs } from "../../services/firebase"

export default function Fees() {
  const navigate = useNavigate()
  const [feeItems, setFeeItems] = useState([])
  const [totalDue, setTotalDue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const [studentSnap, structSnap, recordSnap] = await Promise.all([
          getDocs(collection(db, "students")),
          getDocs(collection(db, "feeStructures")),
          getDocs(collection(db, "feeRecords")),
        ])

        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))
        const child = students[0]
        if (!child) { setLoading(false); return }

        const grade = child.grade || ""

        const structures = []
        structSnap.forEach(d => structures.push({ id: d.id, ...d.data() }))
        const struct = structures.find(s => s.grade === grade)

        const records = []
        recordSnap.forEach(d => records.push({ id: d.id, ...d.data() }))
        const record = records.find(r => r.studentId === child.id)

        const items = []
        if (struct) {
          const fields = [
            { label: "Tuition Fee", field: "tuition" },
            { label: "Transport Fee", field: "transport" },
            { label: "Library Fee", field: "library" },
            { label: "Other Fees", field: "others" },
          ]
          fields.forEach(f => {
            const amt = Number(struct[f.field]) || 0
            if (amt > 0) {
              items.push({ item: f.label, amount: amt, status: "Pending", due: "" })
            }
          })
        }

        if (record) {
          const paid = Number(record.paidAmount) || 0
          const total = Number(record.totalFees) || 0
          if (paid > 0) {
            items.push({ item: "Total Paid", amount: paid, status: "Paid", due: "" })
          }
          const pending = Number(record.pendingAmount) || 0
          if (pending > 0) {
            setTotalDue(pending)
          }
          if (record.paymentHistory) {
            record.paymentHistory.forEach((p, i) => {
              items.push({ item: "Payment " + (i + 1), amount: Number(p.amount) || 0, status: "Paid", due: p.date ? (p.date.toDate ? p.date.toDate().toLocaleDateString() : p.date) : "" })
            })
          }
        }

        setFeeItems(items)
      } catch (err) {
        console.error("Failed to load fees:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFees()
  }, [])

  const pendingTotal = feeItems.filter(f => f.status === "Pending").reduce((a, f) => a + f.amount, 0)

  if (loading) return <div className="p-6 text-center text-gray-400">Loading fees...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Fees & Payments</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Fee Summary</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{(totalDue || pendingTotal).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total pending amount</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Fee Item</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Due Date</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {feeItems.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-400">No fee records found</td></tr>
              ) : feeItems.map((f, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3 text-gray-800 dark:text-white">{f.item}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{f.amount.toLocaleString()}</td>
                  <td className="p-3 text-gray-500">{f.due || "—"}</td>
                  <td className="p-3"><span className={"px-2 py-1 text-xs rounded " + (f.status === "Paid" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300")}>{f.status}</span></td>
                  <td className="p-3">{f.status === "Pending" ? <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Pay</button> : <span className="text-sm text-gray-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
