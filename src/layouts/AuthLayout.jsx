import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Student School</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Educational Ecosystem</p>
              </div>
            </Link>
          </div>
          <Outlet />
        </motion.div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Student School App. All rights reserved.
        </p>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-900 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-6"
          >
            Welcome to the Future of Education
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-primary-100 mb-8"
          >
            A trusted ecosystem connecting schools, teachers, students, and parents for a better educational experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4"
          >
            {['School Management & Administration', 'Student Productivity & Learning', 'Parent-School Communication', 'Safe Educational Community'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-100">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
