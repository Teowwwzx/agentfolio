'use server'

// NOTE: This file now only contains server-side utilities.
// The saved properties feature has been moved to localStorage (client-side).
// See: src/hooks/useSavedProperties.ts

// getSavedListingIds is now a stub that returns empty since saved properties are localStorage-based
export async function getSavedListingIds() {
  // Saved properties are now managed client-side via localStorage
  // This returns an empty array for server-side compatibility
  return []
}

// logSearch is now a no-op since search_history table was removed
export async function logSearch(queryText: string, filters: any) {
  // Search history tracking was removed to simplify the app
  // If needed in future, implement via localStorage or re-add the table
  console.log('Search logged:', { queryText, filters })
}
