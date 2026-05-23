export default function Revenue() {
  const plans = [
    { name: 'Basic', price: 99, schools: 45, revenue: 4455, features: 'Up to 500 users' },
    { name: 'Standard', price: 199, schools: 52, revenue: 10348, features: 'Up to 2000 users' },
    { name: 'Premium', price: 399, schools: 23, revenue: 9177, features: 'Up to 5000 users' },
    { name: 'Enterprise', price: 999, schools: 8, revenue: 7992, features: 'Unlimited users' }
  ]
  return <div className="page-container">
    <div className="page-header">
      <div><h1 className="page-title">Revenue & Subscriptions</h1><p className="page-subtitle">Track platform revenue and subscription plans</p></div>
    </div>
    <div className="dashboard-grid mb-6">
      {[
        { label: 'Monthly Revenue', value: '$31,972', change: '+12.5%', icon: '💰' },
        { label: 'Total Schools', value: '128', change: '+3 this month', icon: '🏫' },
        { label: 'Avg. Revenue/School', value: '$249', change: '+$18', icon: '📊' },
        { label: 'Annual Run Rate', value: '$383,664', change: '↑ 22% YoY', icon: '📈' }
      ].map((s, i) => <div key={i} className="stat-card">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">{s.icon}</div>
        <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p><p className="text-xs text-green-600">{s.change}</p></div>
      </div>)}
    </div>
    <div className="card p-0"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700/50"><tr className="text-left text-gray-500"><th className="p-4">Plan</th><th className="p-4">Price</th><th className="p-4">Schools</th><th className="p-4">Revenue</th><th className="p-4">Features</th></tr></thead><tbody className="divide-y">{plans.map((p, i) => <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="p-4 font-medium text-gray-900 dark:text-white">{p.name}</td><td className="p-4">${p.price}/mo</td><td className="p-4">{p.schools}</td><td className="p-4 font-medium text-green-600">${p.revenue.toLocaleString()}</td><td className="p-4 text-gray-500 text-xs">{p.features}</td></tr>)}</tbody></table></div>
  </div>
}
