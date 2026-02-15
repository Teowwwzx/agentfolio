// Mock analytics data for V2 Dashboard
// Demographics based on Malaysian property market patterns

export const mockAnalyticsData = {
    // Key Metrics
    stats: {
        totalLeads: 247,
        weeklyGrowth: 12,
        totalViews: 8453,
        conversionRate: 3.2,
    },

    // Gender Distribution
    genderBreakdown: [
        { name: 'Male', value: 60, color: '#3B82F6' },
        { name: 'Female', value: 38, color: '#EC4899' },
        { name: 'Other', value: 2, color: '#8B5CF6' },
    ],

    // Age Groups
    ageGroups: [
        { name: '25-34', value: 35 },
        { name: '35-44', value: 30 },
        { name: '45-54', value: 20 },
        { name: '55+', value: 15 },
    ],

    // Race Distribution (Malaysian market)
    raceBreakdown: [
        { name: 'Malay', value: 45, color: '#10B981' },
        { name: 'Chinese', value: 30, color: '#F59E0B' },
        { name: 'Indian', value: 15, color: '#6366F1' },
        { name: 'Others', value: 10, color: '#64748B' },
    ],

    // Location (States)
    locationBreakdown: [
        { name: 'Kuala Lumpur', value: 40 },
        { name: 'Selangor', value: 35 },
        { name: 'Penang', value: 15 },
        { name: 'Johor', value: 7 },
        { name: 'Others', value: 3 },
    ],

    // Budget Ranges
    budgetBreakdown: [
        { name: '<RM300K', value: 20, color: '#22C55E' },
        { name: 'RM300K-500K', value: 40, color: '#3B82F6' },
        { name: 'RM500K-1M', value: 30, color: '#F59E0B' },
        { name: '>RM1M', value: 10, color: '#EF4444' },
    ],

    // Customer Types (for n8n workflow context)
    customerTypes: [
        { name: 'New', value: 55, color: '#22C55E' },
        { name: 'Returning', value: 30, color: '#3B82F6' },
        { name: 'Follow-up', value: 15, color: '#F59E0B' },
    ],

    // Weekly Inquiry Trend
    weeklyTrend: [
        { day: 'Mon', inquiries: 12 },
        { day: 'Tue', inquiries: 18 },
        { day: 'Wed', inquiries: 15 },
        { day: 'Thu', inquiries: 22 },
        { day: 'Fri', inquiries: 28 },
        { day: 'Sat', inquiries: 35 },
        { day: 'Sun', inquiries: 24 },
    ],

    // Top Properties (by views)
    topProperties: [
        { id: '1', title: 'Luxury Condo in Mont Kiara', views: 342, inquiries: 18 },
        { id: '2', title: '3BR Terrace in Damansara', views: 287, inquiries: 12 },
        { id: '3', title: 'Studio Apartment KLCC', views: 256, inquiries: 15 },
        { id: '4', title: 'Semi-D in Subang Jaya', views: 198, inquiries: 8 },
        { id: '5', title: 'Penthouse in Bangsar', views: 156, inquiries: 6 },
    ],

    // Inquiry Sources
    inquirySources: [
        { name: 'WhatsApp', value: 65, color: '#22C55E' },
        { name: 'Telegram', value: 20, color: '#3B82F6' },
        { name: 'Website Form', value: 10, color: '#8B5CF6' },
        { name: 'Instagram', value: 5, color: '#EC4899' },
    ],
}

export type MockAnalyticsData = typeof mockAnalyticsData
