'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav({ isAuth }: { isAuth: boolean }) {
  const pathname = usePathname()

  // Hide on admin pages and login pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/agent/login') || pathname === '/admin/auth/login') return null

  const isActive = (path: string) => pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-safe pt-2 px-6 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around mb-2">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 min-w-[64px]",
            isActive('/') ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/saved"
          className={cn(
            "flex flex-col items-center gap-1 min-w-[64px]",
            isActive('/saved') ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Heart className="h-6 w-6" />
          <span className="text-[10px] font-medium">Saved</span>
        </Link>

        {isAuth && (
          <Link
            href="/admin"
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px]",
              pathname.startsWith('/admin') ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        )}
      </div>
    </div>
  )
}
