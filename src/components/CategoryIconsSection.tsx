
import Link from 'next/link'
import {
    Home,
    Building2,
    Factory,
    Trees,
    Sprout,
    Warehouse,
    Map as MapIcon
} from 'lucide-react'
import { prisma } from '@/lib/prisma'

const ICON_MAP: Record<string, any> = {
    residential: Home,
    commercial: Building2,
    industrial: Factory,
    land: MapIcon,
    agriculture: Sprout,
    development: Warehouse
}

export async function CategoryIconsSection() {
    const categories = await prisma.property_categories.findMany({
        orderBy: { name: 'asc' },
        take: 6
    })

    if (categories.length === 0) return null

    return (
        <div className="py-4">
            <div className="flex justify-between items-center px-6 md:justify-center md:gap-12 overflow-x-auto pb-4 hide-scrollbar">
                {categories.map((category) => {
                    const Icon = ICON_MAP[category.slug] || Home

                    return (
                        <Link
                            key={category.id}
                            href={`/properties?category=${category.slug}`}
                            className="flex flex-col items-center gap-3 group min-w-[80px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm border border-orange-100 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-md group-hover:-translate-y-1">
                                <Icon size={28} strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 text-center tracking-tight group-hover:text-orange-600 transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
