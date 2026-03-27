# MIRA'S Website Upgrade Roadmap

## Goal
Ship the requested UX and growth upgrades in a safe sequence, with measurable wins after each phase.

## Working Style
- Implement one feature group at a time.
- After each group: test locally, validate on mobile + desktop, then move to next group.
- Keep all changes behind existing routes/components (no breaking redesign).

---

## Phase 0 - Foundations (Required Before Features)

### 0.1 Data model updates (Supabase)
We need fields to support social proof and flash countdown:
- products.sold_count (integer, default 0)
- products.flash_sale_ends_at (timestamptz, nullable)

### 0.2 Indexes
- idx_products_created_at on created_at desc
- idx_products_sold_count on sold_count desc
- idx_products_flash_ends on flash_sale_ends_at

### 0.3 Frontend mapping updates
Update src/supabase.js mapProduct() with:
- soldCount
- flashSaleEndsAt

### Acceptance criteria
- DB migration runs successfully.
- New fields appear in Supabase table editor.
- App still loads products without errors.

---

## Phase 1 - Storefront Revenue Features (High Impact)

### 1.1 Social proof: Sold X times
Add on:
- Product cards (Shop, FlashDrops, FeaturedProduct)
- Product details page (Product)

Fallback behavior:
- If soldCount is 0 or null, hide badge.

### 1.2 New Arrivals carousel (homepage)
Create component: src/components/NewArrivalsCarousel.jsx
- Query newest products by created_at desc
- Horizontal swipe on mobile, arrows on desktop
- Reuse existing card design language

### 1.3 Sticky Add to Cart on product page (mobile)
On Product page:
- Sticky bottom bar on small screens
- Show active price + qty summary + add button
- Respect out-of-stock/low-stock states

### 1.4 Sort in Shop
Add sort dropdown:
- Price low to high
- Price high to low
- Newest
- Best selling (sold_count desc)

Apply sort after filters.

### 1.5 Stock urgency badge
Add explicit urgency badge when stock <= 3:
- Only X left on product card and product page

### Acceptance criteria
- Homepage has working New Arrivals carousel.
- Shop sorting works with all filter combinations.
- Mobile product page has sticky bar and no overlap issues.

---

## Phase 2 - Flash Drop Countdown

### 2.1 Admin support
Update add/edit product forms:
- Add Flash ends at datetime input when flash is enabled.
- Validate: end time must be in future when setting flash.

### 2.2 Flash status logic
In src/supabase.js update isFlashSaleActive(product):
- Must be isFlashSale = true
- Must have valid flash price < base price
- Must not be expired (now < flashSaleEndsAt) when end date exists

### 2.3 Countdown UI
On:
- FlashDrops cards
- Product page (if on flash)

Show:
- Ends in HH:MM:SS (or D:H:M:S if > 24h)
- Auto-hide or mark expired when countdown reaches zero

### Acceptance criteria
- Countdown ticks in real-time.
- Expired flash products automatically revert to normal pricing.

---

## Phase 3 - Search Quality Upgrade

### 3.1 Category chips in search overlay
Add chips:
- Brand
- Scent family
- Collection type
- Flash Drop

### 3.2 Typo tolerance
Implement client-side fuzzy matching (Fuse.js or lightweight custom scoring):
- Handle typos like latafa -> lattafa
- Search over name, brand, scentFamily, notes

### 3.3 Ranking
Prioritize exact matches > prefix > fuzzy.

### Acceptance criteria
- Typos still return relevant products.
- Chips filter results instantly.

---

## Phase 4 - SEO Package

### 4.1 Page metadata
Set dynamic title and description for:
- Home
- Shop
- Product details
- Brands

### 4.2 OpenGraph + Twitter tags
Add social meta tags for key pages.

### 4.3 Structured data
Add JSON-LD:
- Product schema on product page
- Organization schema on home

### 4.4 Sitemap + robots
- Generate public/sitemap.xml
- Add public/robots.txt

### Acceptance criteria
- Source HTML contains expected meta tags.
- Product page includes valid JSON-LD.

---

## Phase 5 - Performance Package

### 5.1 Image optimization pipeline
- Use optimized dimensions from upload flow
- Add width/height where possible
- Keep lazy loading for non-critical images

### 5.2 Lazy loading
- Add loading="lazy" to non-critical images
- Keep hero/critical image eager

### 5.3 Code splitting
- Route-level lazy load for admin pages and heavy pages
- Reduce main bundle size warning

### 5.4 Runtime polish
- Memoize expensive list transforms where needed
- Avoid duplicate fetches on homepage blocks where possible

### Acceptance criteria
- Improved Lighthouse Performance score.
- Reduced initial JS payload.

---

## Execution Order (One-by-One)
1. Phase 0 (foundations)
2. Phase 1 (revenue/UX)
3. Phase 2 (flash countdown)
4. Phase 3 (search)
5. Phase 4 (SEO)
6. Phase 5 (performance)

---

## Tracking Checklist
- [x] Phase 0 complete
- [x] Phase 1 complete
- [x] Phase 2 complete
- [x] Phase 3 complete
- [x] Phase 4 complete
- [x] Phase 5 complete

---

## Notes for Current Project
- Flash price logic already exists in several components.
- EditProduct route and page are already present.
- FlashDrops section already exists on homepage.
- Next immediate task: Phase 0 migration + mapping updates.
