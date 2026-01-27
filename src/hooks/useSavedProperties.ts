'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'agentfolio_saved_properties'

export function useSavedProperties() {
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setSavedIds(new Set(parsed))
            } catch (e) {
                console.error('Failed to parse saved properties', e)
            }
        }
        setIsLoaded(true)
    }, [])

    const toggleSaved = (id: string) => {
        setSavedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]))
            return newSet
        })
    }

    const isSaved = (id: string) => savedIds.has(id)

    const getSavedIds = () => [...savedIds]

    return {
        savedIds,
        toggleSaved,
        isSaved,
        getSavedIds,
        isLoaded,
    }
}
