import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const ROLES_LIST = [
  { value: 'student', label: 'Student', icon: '🎓' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' }
]

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student', schoolId: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, { name: form.name, role: form.role, schoolId: form.schoolId, phone: form.phone })
      toast.success('Account created! Awaiting approval.')
      navigate('/auth/approval')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Join the educational ecosystem</p>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select your role</p>
          <div className="grid grid-cols-1 gap-3">
            {ROLES_LIST.map(r => (
              <button key={r.value} onClick={() => { update('role', r.value); setStep(2) }}
                className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${form.role === r.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                <span className="text-3xl">{r.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{r.label}</p>
                  <p className="text-sm text-gray-500">{r.value === 'student' ? 'Access homework, results & learning tools' : r.value === 'parent' ? 'Monitor your child\'s academic progress' : 'Manage classes, homework & assessments'}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/auth/login" className="text-primary-600 font-medium">Sign in</Link></p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@school.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number (optional)</label>
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="+1 234 567 890" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School ID (if applicable)</label>
            <input type="text" value={form.schoolId} onChange={(e) => update('schoolId', e.target.value)} className="input-field" placeholder="e.g. SCH-2024-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input-field" placeholder="Min. 6 characters" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="input-field" placeholder="Re-enter password" required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}
