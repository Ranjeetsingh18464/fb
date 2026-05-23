import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, getDocs, query, where } from "../../services/firebase"

export default function Reports() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState("academic")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [selectedType])

  const fetchReportData = async () => {
    setLoading(true)
    setData(null)
    try {
      let result
      if (selectedType === "academic") {
        const [resultSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, "results")),
          getDocs(collection(db, "students")),
        ])
        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))

        const rows = []
        resultSnap.forEach(d => {
          const r = d.data()
          const examName = r.exam || r.name || "Unknown"
          const grade = r.grade || ""
          const section = r.section || ""
          const matched = students.filter(s => (s.grade || s.class) === grade && s.section === section)
          ;(r.subjects || []).forEach(s => {
            matched.forEach(st => {
              rows.push({ Student: st.name || st.studentId, Subject: s.name, Marks: s.marks, "Max Marks": s.total, Percentage: s.total ? ((s.marks / s.total) * 100).toFixed(1) + "%" : "—", Exam: examName, Grade: grade, Section: section })
            })
          })
        })
        result = rows
      } else if (selectedType === "attendance") {
        const snap = await getDocs(collection(db, "attendance"))
        const rows = []
        snap.forEach(d => {
          const r = d.data()
          rows.push({ Student: r.studentName || r.name || r.id, Grade: r.grade, Section: r.section, Status: r.status, Date: r.date || "", Month: r.month, Year: r.year })
        })
        result = rows
      } else if (selectedType === "fee") {
        const [recordSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, "feeRecords")),
          getDocs(collection(db, "students")),
        ])
        const students = []
        studentSnap.forEach(d => students.push({ id: d.id, ...d.data() }))
        const rows = []
        recordSnap.forEach(d => {
          const r = d.data()
          const st = students.find(s => s.id === r.studentId)
          rows.push({ Student: st?.name || r.studentName || r.studentId || d.id, "Total Fees": r.totalFees, "Paid": r.paidAmount, Pending: r.pendingAmount, Status: r.status || "" })
        })
        result = rows
      }
      setData(result || [])
    } catch (err) {
      console.error("Failed to load report data:", err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const rows = data
    if (!rows || rows.length === 0) { alert("No data to download"); return }
    const headers = Object.keys(rows[0])
    const lines = [headers.join(",")]
    rows.forEach(r => {
      lines.push(headers.map(h => {
        const v = r[h] ?? ""
        return typeof v === "string" && (v.includes(",") || v.includes('"') || v.includes("\n")) ? `"${v.replace(/"/g, '""')}"` : v
      }).join(","))
    })
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = selectedType + "_report.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadExcel = () => {
    const rows = data
    if (!rows || rows.length === 0) { alert("No data to download"); return }
    const headers = Object.keys(rows[0])
    let html = `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`
    rows.forEach(r => { html += `<tr>${headers.map(h => `<td>${r[h] ?? ""}</td>`).join("")}</tr>` })
    html += "</tbody></table>"
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = selectedType + "_report.xls"; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    const rows = data
    if (!rows || rows.length === 0) { alert("No data to download"); return }
    const headers = Object.keys(rows[0])
    let html = `<html><head><style>table{border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f5f5f5}</style></head><body><h2>${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Report</h2><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`
    rows.forEach(r => { html += `<tr>${headers.map(h => `<td>${r[h] ?? ""}</td>`).join("")}</tr>` })
    html += "</tbody></table></body></html>"
    const w = window.open("", "_blank")
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print() }
  }

  const reportTypes = [
    { id: "academic", label: "Academic Report", desc: "Student grades and subject-wise performance" },
    { id: "attendance", label: "Attendance Report", desc: "Daily and monthly attendance records" },
    { id: "fee", label: "Fee Report", desc: "Fee collection and pending dues" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Generate Reports</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Type</h2>
              <div className="space-y-3">
                {reportTypes.map((rt) => (
                  <label key={rt.id} className={"block p-4 rounded-lg border-2 cursor-pointer transition-colors " + (selectedType === rt.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600")}>
                    <input type="radio" name="reportType" value={rt.id} checked={selectedType === rt.id} onChange={() => setSelectedType(rt.id)} className="sr-only" />
                    <p className="font-medium text-gray-900 dark:text-white">{rt.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{rt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Preview</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8"><div className="animate-spin h-6 w-6 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>
              ) : !data || data.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No data available for this report</p>
              ) : (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-gray-50 dark:bg-gray-700/50">
                      {Object.keys(data[0]).map(k => <th key={k} className="text-left px-2 py-1.5 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{k}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {data.slice(0, 20).map((r, i) => (
                        <tr key={i}>
                          {Object.values(r).map((v, j) => <td key={j} className="px-2 py-1.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">{v ?? "—"}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.length > 20 && <p className="text-xs text-gray-400 text-center py-2">Showing 20 of {data.length} records</p>}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 lg:self-start">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Generate and download the selected report in your preferred format.</p>
            <div className="space-y-3">
              <button onClick={downloadPDF} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Download as PDF</button>
              <button onClick={downloadExcel} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Download as Excel</button>
              <button onClick={downloadCSV} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Download as CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
