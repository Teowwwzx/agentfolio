'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'agentfolio_search_history'
const MAX_HISTORY = 10

export interface SearchHistoryItem {
    query: string
    timestamp: number
}

export function useSearchHistory() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setHistory(parsed)
            } catch (e) {
                console.error('Failed to parse search history', e)
            }
        }
    }, [])

    const addToHistory = (query: string) => {
        if (!query.trim()) return

        setHistory(prev => {
            const filtered = prev.filter(item => item.query !== query)
            const newHistory = [
                { query, timestamp: Date.now() },
                ...filtered
            ].slice(0, MAX_HISTORY)

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
            return newHistory
        })
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem(STORAGE_KEY)
    }

    return {
        history,
        addToHistory,
        clearHistory,
    }
}
