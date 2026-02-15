'use client'

import { mockAnalyticsData } from '@/lib/mockAnalytics'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'
import { TrendingUp, Users, Eye, Target, ChevronRight } from 'lucide-react'

export default function AnalyticsPage() {
    const data = mockAnalyticsData

    return (
        <div className="p-4 md:p-6 space-y-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Leads"
                    value={data.stats.totalLeads.toString()}
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    change={`+${data.stats.weeklyGrowth}%`}
                    positive
                />
                <MetricCard
                    title="Total Views"
                    value={data.stats.totalViews.toLocaleString()}
                    icon={<Eye className="w-5 h-5 text-green-500" />}
                />
                <MetricCard
                    title="Conversion"
                    value={`${data.stats.conversionRate}%`}
                    icon={<Target className="w-5 h-5 text-orange-500" />}
                />
                <MetricCard
                    title="Avg. Response"
                    value="2.4h"
                    icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
                />
            </div>

            {/* Weekly Trend Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-4">Weekly Inquiries</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="inquiries" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Demographics Row */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Gender */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Gender</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={data.genderBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                            >
                                {data.genderBreakdown.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Age Groups */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Age Groups</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={data.ageGroups} layout="vertical">
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={50} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Budget */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Budget Range</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={data.budgetBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                            >
                                {data.budgetBreakdown.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Location & Race Row */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Location */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Location</h2>
                    <div className="space-y-3">
                        {data.locationBreakdown.map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700">{loc.name}</span>
                                        <span className="text-slate-500">{loc.value}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${loc.value}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Race */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Race</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data.raceBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                            >
                                {data.raceBreakdown.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Inquiry Sources */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-4">Inquiry Sources</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {data.inquirySources.map((source, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-3 rounded-lg border border-slate-100"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: source.color }}
                            />
                            <div>
                                <p className="text-sm font-medium text-slate-900">{source.name}</p>
                                <p className="text-xs text-slate-500">{source.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Properties */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-4">Top Properties</h2>
                <div className="space-y-3">
                    {data.topProperties.map((prop, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                    {idx + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{prop.title}</p>
                                    <p className="text-xs text-slate-500">
                                        {prop.views} views · {prop.inquiries} inquiries
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Types */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <h2 className="font-semibold text-slate-900 mb-2">Customer Types</h2>
                <p className="text-xs text-slate-500 mb-4">Based on n8n workflow classification</p>
                <div className="flex gap-4">
                    {data.customerTypes.map((type, idx) => (
                        <div key={idx} className="flex-1 text-center">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: type.color }}
                            >
                                {type.value}%
                            </div>
                            <p className="text-sm text-slate-600">{type.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Metric Card Component
function MetricCard({
    title,
    value,
    icon,
    change,
    positive
}: {
    title: string
    value: string
    icon: React.ReactNode
    change?: string
    positive?: boolean
}) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
                {icon}
                {change && (
                    <span className={`text-xs font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{title}</p>
        </div>
    )
}
