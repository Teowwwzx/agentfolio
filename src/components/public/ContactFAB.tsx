'use client'

import { useState } from 'react'
import { MessageCircle, X, Phone, Send, Instagram, Facebook, Mail } from 'lucide-react'

interface ContactFABProps {
    whatsapp?: string | null
    telegram?: string | null
    instagram?: string | null
    facebook?: string | null
    email?: string | null
    phone?: string | null
}

export function ContactFAB({ whatsapp, telegram, instagram, facebook, email, phone }: ContactFABProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Check if any contact method is available
    const hasContacts = whatsapp || telegram || instagram || facebook || email || phone
    if (!hasContacts) return null

    const toggleOpen = () => setIsOpen(!isOpen)

    const contactOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            value: whatsapp,
            href: `https://wa.me/${whatsapp || ''}`,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            name: 'Telegram',
            icon: Send,
            value: telegram,
            href: telegram?.startsWith('@')
                ? `https://t.me/${telegram.slice(1)}`
                : `https://t.me/${telegram || ''}`,
            color: 'bg-blue-400 hover:bg-blue-500',
        },
        {
            name: 'Instagram',
            icon: Instagram,
            value: instagram,
            href: instagram?.startsWith('@')
                ? `https://instagram.com/${instagram.slice(1)}`
                : `https://instagram.com/${instagram || ''}`,
            color: 'bg-pink-500 hover:bg-pink-600',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            value: facebook,
            href: facebook || '#',
            color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
            name: 'Email',
            icon: Mail,
            value: email,
            href: `mailto:${email || ''}`,
            color: 'bg-gray-600 hover:bg-gray-700',
        },
        {
            name: 'Call',
            icon: Phone,
            value: phone,
            href: `tel:+${phone || ''}`,
            color: 'bg-slate-700 hover:bg-slate-800',
        },
    ].filter(opt => opt.value)

    return (
        <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
            {/* Contact Options */}
            <div
                className={`flex flex-col gap-2 mb-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {contactOptions.map((option) => (
                    <a
                        key={option.name}
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-4 py-2 rounded-full text-white shadow-lg ${option.color} transition-all duration-200`}
                    >
                        <option.icon size={20} />
                        <span className="text-sm font-medium">{option.name}</span>
                    </a>
                ))}
            </div>

            {/* FAB Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isOpen
                    ? 'bg-slate-800 rotate-45'
                    : 'bg-gradient-to-br from-green-400 to-green-600'
                    }`}
                aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-white" />
                )}
            </button>
        </div>
    )
}
