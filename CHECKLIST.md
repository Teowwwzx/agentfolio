
# AgentFolio Feature Checklist

## 1. Public Site (User Experience)
- [x] **Homepage**
  - [x] Hero Section with Search
  - [x] Dynamic Sections (Featured, Latest, Categories) - Configurable by Admin
  - [x] Property Carousel
- [x] **Property Listing**
  - [x] Grid/List View
  - [x] Advanced Filters (Location, Category, Type, Price)
  - [x] Real-time Search (Debounced)
- [x] **Property Details**
  - [x] Image Gallery (Grid + Modal + Carousel)
  - [x] Key Features (Beds, Baths, Sqft)
  - [x] Agent Contact Info (Partial)
- [x] **User Features**
  - [x] Saved Properties (Heart Icon + Saved Page)
  - [x] Search History (Auto-logging)

## 2. Agent Dashboard (Current `/admin`)
*For real estate agents to manage their portfolio.*
- [x] **Listings Management**
  - [x] Create Listing (Wizard/Form)
  - [x] Edit Listing (Modal)
  - [x] Delete Listing (Modal)
  - [x] View My Listings (Table with Search/Filter) - *Moved to `/admin/listings`*
- [x] **Leads & Analytics**
  - [ ] View Inquiries
  - [x] Dashboard Overview (Stats) - *New `/admin` page*
- [x] **Profile**
  - [x] Basic Auth (Login/Logout) - *Added Role Support*
  - [ ] Profile Settings (Photo, Contact Info)

## 3. Super Admin Dashboard (Planned)
*For platform administrators to manage agents and site content.*
- [x] **Site Content**
  - [x] Manage Homepage Sections (Create/Edit/Reorder)
  - [ ] Manage Banners/Ads
- [x] **User Management**
  - [x] View All Agents (Placeholder)
  - [ ] Approve/Ban Agents
- [x] **System Settings**
  - [x] Manage Categories & Types (via DB seeds currently)
  - [x] Platform Settings (Placeholder)

## 4. Infrastructure & System
- [x] **Database**
  - [x] PostgreSQL (Neon Production / Docker Local)
  - [x] Migrations Setup (`npm run db:migrate`)
- [x] **Authentication**
  - [x] Custom JWT (Current)
  - [x] Neon Auth Integration (Ready for Env Vars)
- [x] **Storage**
  - [x] Cloudinary (Image Uploads)
- [ ] **Deployment**
  - [ ] Vercel/Netlify Setup
