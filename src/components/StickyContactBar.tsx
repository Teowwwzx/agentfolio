import { Phone, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyContactBarProps {
  phoneNumber: string
  message: string
  className?: string
}

export function StickyContactBar({ phoneNumber, message, className }: StickyContactBarProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
  const callUrl = `tel:${phoneNumber}`

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]", className)}>
      <div className="mx-auto flex max-w-5xl gap-3">
        <a 
          href={callUrl}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <Phone className="h-5 w-5" />
          Call Now
        </a>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-semibold text-white transition-colors hover:bg-[#20bd5a] active:bg-[#1da851]"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
