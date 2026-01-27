'use client'

import { toggleEditMode } from '@/actions/settings'
import { Button } from '@/components/ui/button'

interface EditModeToggleProps {
    isEditMode: boolean
}

export function EditModeToggle({ isEditMode }: EditModeToggleProps) {
    return (
        <form action={toggleEditMode}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">Homepage Edit Mode</span>
                    <span className="text-sm text-slate-500">Show edit/delete buttons on homepage sections</span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="edit_mode"
                        className="sr-only peer"
                        defaultChecked={isEditMode}
                        onChange={(e) => e.target.form?.requestSubmit()}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {/* Fallback button if JS disabled or for explicit save */}
            <noscript>
                <div className="mt-4">
                    <Button type="submit">Save Changes</Button>
                </div>
            </noscript>
        </form>
    )
}
