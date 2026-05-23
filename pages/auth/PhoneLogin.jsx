import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function PhoneLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Firebase phone auth would go here
      toast.success('OTP sent to your phone')
      setStep(2)
    } catch (err) {
      toast.error('Failed to send OTP')
    } finally { setLoading(false) }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.success('Phone login successful')
      navigate('/')
    } catch (err) {
      toast.error('Invalid OTP')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Phone Login</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Use your phone number to sign in</p>
      {step === 1 ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 234 567 890" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-field text-center text-2xl tracking-widest" placeholder="• • • • • •" maxLength={6} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify OTP'}</button>
          <button type="button" onClick={() => setStep(1)} className="btn-ghost w-full text-sm">Change phone number</button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-gray-500"><Link to="/auth/login" className="text-primary-600 font-medium">Back to email login</Link></p>
    </motion.div>
  )
}
