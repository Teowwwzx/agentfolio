export interface Listing {
  id: string
  user_id: string
  title: string
  description: string | null
  price: number
  location: string | null
  place_id: string | null
  property_type: string | null // Keep for backward compatibility or display
  category_id: string | null
  type_id: string | null
  bedrooms: number | null
  bathrooms: number | null
  sqft: number | null
  status: 'active' | 'sold' | 'hidden'
  created_at: Date
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  display_order: number
  created_at: Date
}

export interface Profile {
  id: string
  full_name: string | null
  description: string | null
  phone_number: string | null
  avatar_url: string | null
  updated_at: Date
}

// Composite type for UI
export interface ListingWithImages extends Listing {
  images: ListingImage[]
  // Agent details for property page
  agent_name?: string
  phone_number?: string
  agent_email?: string
  isRenovated?: boolean
  tags?: string[]
}
