import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { db, doc, onSnapshot } from '../../services/firebase'

export default function AccountApproval() {
  const navigate = useNavigate()
  const { user, userProfile, signOut } = useAuth()
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    if (!user) { navigate('/auth/login', { replace: true }); return }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setStatus(data.isApproved ? 'approved' : 'pending')
        if (data.isApproved) {
          setTimeout(() => navigate('/'), 2000)
        }
      }
    })
    return () => unsub()
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-md w-full text-center">
        {status === 'approved' ? (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Approved!</h2>
            <p className="text-gray-500 dark:text-gray-400">Redirecting to your dashboard...</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Awaiting Approval</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Your account is under review. A school administrator will verify your details shortly.</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left text-sm space-y-2">
              <p className="text-gray-600 dark:text-gray-400"><strong>Role:</strong> <span className="capitalize">{userProfile?.role?.replace('_', ' ') || 'N/A'}</span></p>
              <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> {userProfile?.email || user?.email}</p>
              <p className="text-gray-600 dark:text-gray-400"><strong>Status:</strong> <span className="badge-warning">Pending Verification</span></p>
            </div>
            <p className="mt-6 text-sm text-gray-400">This page will update automatically once approved.</p>
            <button
              onClick={async () => { await signOut(); navigate('/auth/login') }}
              className="mt-4 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 underline"
            >
              Sign in with a different account
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
