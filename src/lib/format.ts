/**
 * Format number with thousand separators
 * Handles numbers, strings, and Prisma Decimals
 * @example formatNumber(1200000) // "1,200,000"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatNumber(num: number | string | any | null | undefined): string {
    if (num === null || num === undefined) return '0'
    const value = Number(num)
    if (isNaN(value)) return '0'
    return value.toLocaleString('en-US')
}

/**
 * Format currency with RM prefix and thousand separators
 * Handles numbers, strings, and Prisma Decimals
 * @example formatCurrency(1200000) // "RM 1,200,000"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatCurrency(amount: number | string | any | null | undefined): string {
    if (amount === null || amount === undefined) return 'RM 0'
    const value = Number(amount)
    if (isNaN(value)) return 'RM 0'
    return `RM ${value.toLocaleString('en-US')}`
}

/**
 * Format number in compact notation for large numbers
 * @example formatCompact(1200000) // "1.2M"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatCompact(val: number | string | any | null | undefined): string {
    if (val === null || val === undefined) return '0'
    const num = Number(val)
    if (isNaN(num)) return '0'

    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toString()
}
