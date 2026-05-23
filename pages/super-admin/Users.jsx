export default function Users() {
  return <div className="page-container">
    <div className="page-header">
      <div><h1 className="page-title">User Management</h1><p className="page-subtitle">Manage all platform users across schools</p></div>
    </div>
    <div className="card overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700/50"><tr className="text-left text-gray-500"><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">School</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y">{[...Array(8)].map((_, i) => (<tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">U</div><div><p className="font-medium text-gray-900 dark:text-white">User {i + 1}</p><p className="text-xs text-gray-500">user{i + 1}@school.com</p></div></div></td><td className="p-4 capitalize text-gray-600 dark:text-gray-400">{[...['student','teacher','parent','school_admin','principal','student','teacher','parent']][i]}</td><td className="p-4 text-gray-600 dark:text-gray-400">School {Math.floor(i / 2) + 1}</td><td className="p-4"><span className="badge-success">Active</span></td><td className="p-4"><button className="btn-ghost text-xs">Manage</button></td></tr>))}</tbody></table></div>
  </div>
}
