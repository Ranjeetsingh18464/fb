export default function AdControls() {
  return <div className="page-container">
    <div className="page-header">
      <div><h1 className="page-title">Advertisement Controls</h1><p className="page-subtitle">Manage ads across the platform</p></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Native Banner Ads</h3><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div></label></div>
        <p className="text-sm text-gray-500">Show non-intrusive banner ads on dashboard sidebars</p>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Dashboard Ads</h3><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div></label></div>
        <p className="text-sm text-gray-500">Show ads in dashboard widget areas</p>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Rewarded Ads</h3><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div></label></div>
        <p className="text-sm text-gray-500">Optional rewarded ads for premium features</p>
      </div>
    </div>
    <div className="card mt-6">
      <h3 className="font-semibold mb-4">Ad-Free Premium</h3>
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"><div><p className="font-medium text-gray-900 dark:text-white">Ad-Free Subscription</p><p className="text-sm text-gray-500">Schools can pay to remove all ads for their users</p></div><span className="badge-primary">$199/mo per school</span></div>
    </div>
  </div>
}
