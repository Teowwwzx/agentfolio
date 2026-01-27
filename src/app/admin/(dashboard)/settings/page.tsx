import { cookies } from 'next/headers'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const isEditMode = cookieStore.get('edit_mode')?.value === 'true'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your application preferences</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-1">General Settings</h2>
          <p className="text-sm text-slate-500">Global application configuration.</p>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500">No additional settings available at this time.</p>
        </div>
      </div>
    </div>
  )
}
