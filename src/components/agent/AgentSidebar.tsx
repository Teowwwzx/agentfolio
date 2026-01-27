'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard,
    Home,
    Tag,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Layers
} from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface AgentSidebarProps {
    user: {
        name: string
        email: string | unknown
        role: string
    }
}

export function AgentSidebar({ user }: AgentSidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (path: string) => pathname === path

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            <div className="flex h-16 items-center border-b border-slate-200 px-6 justify-between">
                <Link
                    href="/agent/dashboard"
                    className="text-xl font-bold text-blue-600"
                    onClick={() => setIsOpen(false)}
                >
                    AgentFolio <span className="text-slate-400 font-normal text-sm">Dashboard</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-4">
                    <Link
                        href="/agent/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/dashboard')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>

                    <Link
                        href="/agent/listings"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/listings')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Home className="h-5 w-5" />
                        Listings
                    </Link>

                    <Link
                        href="/agent/banners"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/banners')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Tag className="h-5 w-5" />
                        Banners
                    </Link>

                    <Link
                        href="/agent/sections"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/sections')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Layers className="h-5 w-5" />
                        Sections
                    </Link>

                    <Link
                        href="/agent/profile"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/profile')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <User className="h-5 w-5" />
                        Profile
                    </Link>

                    <Link
                        href="/agent/settings"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive('/agent/settings')
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </div>

            <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email as string}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:hidden">
                <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600">
                    <Menu size={24} />
                </button>
                <span className="ml-2 text-lg font-bold text-blue-600">AgentFolio</span>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col shadow-lg">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    )
}
