
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Home, Users, BarChart2, Smartphone, ArrowRight, CheckCircle } from 'lucide-react'

export default async function LandingPage() {
    const session = await getSession()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">AgentFolio</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <Link
                                href="/agent/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                                My Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/agent/login"
                                    className="text-slate-300 hover:text-white transition font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/agent/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        Platform for Property Agents
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Your Properties,<br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Your Brand
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Create your professional property portfolio in minutes.
                        Share your unique link with clients and close more deals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/agent/register"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-blue-500/25"
                        >
                            Start Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/a/demo"
                            className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-slate-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
                        Professional tools designed specifically for property agents.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6" />}
                            title="Mobile-First"
                            description="Your portfolio looks stunning on any device. Share via WhatsApp, Instagram, or any platform."
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Team Management"
                            description="Build your team, track commissions, and collaborate on listings together."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-6 h-6" />}
                            title="Analytics"
                            description="Understand your audience with detailed insights on views, demographics, and inquiries."
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Your Unique URL
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                Get a personalized link like <span className="text-blue-400 font-mono">agentfolio.com/a/yourname</span> that you can share everywhere.
                            </p>
                            <ul className="space-y-4">
                                <BenefitItem text="Customizable URL slug" />
                                <BenefitItem text="Professional property showcase" />
                                <BenefitItem text="Integrated contact buttons" />
                                <BenefitItem text="Save time with easy management" />
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600">
                            <div className="bg-slate-900 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-2 font-mono">agentfolio.com/a/john</span>
                                </div>
                                <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Home className="w-16 h-16 text-blue-400/50" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm text-center">
                                Your professional property portfolio
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Grow Your Business?
                    </h2>
                    <p className="text-white/80 mb-8 text-lg">
                        Join hundreds of agents already using AgentFolio.
                    </p>
                    <Link
                        href="/agent/register"
                        className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition hover:bg-slate-100"
                    >
                        Create Your Portfolio <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">AgentFolio</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2026 AgentFolio. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    )
}

function BenefitItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-300">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            {text}
        </li>
    )
}
