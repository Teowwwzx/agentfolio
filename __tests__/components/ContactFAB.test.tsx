import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactFAB } from '@/components/public/ContactFAB'

describe('ContactFAB Component', () => {
    it('renders nothing when no contact methods are provided', () => {
        const { container } = render(<ContactFAB />)
        expect(container.firstChild).toBeNull()
    })

    it('renders FAB button when whatsapp is provided', () => {
        render(<ContactFAB whatsapp="60123456789" />)
        const fabButton = screen.getByRole('button', { name: /open contact menu/i })
        expect(fabButton).toBeInTheDocument()
    })

    it('shows contact options when FAB is clicked', () => {
        render(<ContactFAB whatsapp="60123456789" telegram="@testuser" />)

        // FAB should be visible
        const fabButton = screen.getByRole('button', { name: /open contact menu/i })
        expect(fabButton).toBeInTheDocument()

        // Click to open
        fireEvent.click(fabButton)

        // Contact links should be visible
        expect(screen.getByText('WhatsApp')).toBeInTheDocument()
        expect(screen.getByText('Telegram')).toBeInTheDocument()
    })

    it('generates correct WhatsApp URL', () => {
        render(<ContactFAB whatsapp="60123456789" />)
        fireEvent.click(screen.getByRole('button', { name: /open contact menu/i }))

        const whatsappLink = screen.getByText('WhatsApp').closest('a')
        expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/60123456789')
    })

    it('handles Telegram handle with @ prefix', () => {
        render(<ContactFAB telegram="@myhandle" />)
        fireEvent.click(screen.getByRole('button', { name: /open contact menu/i }))

        const telegramLink = screen.getByText('Telegram').closest('a')
        expect(telegramLink).toHaveAttribute('href', 'https://t.me/myhandle')
    })

    it('handles Instagram handle with @ prefix', () => {
        render(<ContactFAB instagram="@instauser" />)
        fireEvent.click(screen.getByRole('button', { name: /open contact menu/i }))

        const instagramLink = screen.getByText('Instagram').closest('a')
        expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/instauser')
    })

    it('displays email with mailto link', () => {
        render(<ContactFAB email="test@example.com" />)
        fireEvent.click(screen.getByRole('button', { name: /open contact menu/i }))

        const emailLink = screen.getByText('Email').closest('a')
        expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com')
    })

    it('closes menu when clicked again', () => {
        render(<ContactFAB whatsapp="60123456789" />)
        const fabButton = screen.getByRole('button', { name: /open contact menu/i })

        // Open
        fireEvent.click(fabButton)
        expect(screen.getByText('WhatsApp')).toBeInTheDocument()

        // Close (button label changes)
        const closeButton = screen.getByRole('button', { name: /close contact menu/i })
        fireEvent.click(closeButton)

        // WhatsApp text may still be in DOM but hidden via CSS
        // We just verify the button is back to "open" state
        expect(screen.getByRole('button', { name: /open contact menu/i })).toBeInTheDocument()
    })
})
