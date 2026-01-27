'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Home, 
  Layers, 
  Users, 
  Building2,
  Settings,
  Menu,
  X
} from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  user: {
    name: string
    email: string | unknown
    role: string
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const isSuperAdmin = user.role === 'super_admin'
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 justify-between">
        <Link href="/admin" className="text-xl font-bold text-slate-900" onClick={() => setIsOpen(false)}>
          AgentFolio <span className="text-slate-400 font-normal">{isSuperAdmin ? 'Super' : 'Agent'}</span>
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          <div className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overview
          </div>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive('/admin') 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          
          <div className="mt-8 mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Management
          </div>

          {/* Agent Links */}
          {!isSuperAdmin && (
            <>
              <Link
                href="/admin/listings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive('/admin/listings') || isActive('/admin/listings/create')
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Building2 className="h-5 w-5" />
                My Listings
              </Link>
              <Link
                href="/admin/listings/create"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive('/admin/listings/create')
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <PlusCircle className="h-5 w-5" />
                Add Listing
              </Link>
            </>
          )}

          {/* Super Admin Links */}
          {isSuperAdmin && (
            <>
              <Link
                href="/admin/sections"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive('/admin/sections')
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Layers className="h-5 w-5" />
                Page Sections
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive('/admin/users')
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Users className="h-5 w-5" />
                Users
              </Link>
            </>
          )}

          <div className="mt-8 mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <Link
            href="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive('/admin/settings')
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Home className="h-5 w-5" />
            View Public Site
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
      <div className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden">
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
        <span className="ml-2 text-lg font-bold text-slate-900">AgentFolio</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  )
}
