<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project Overview

Next.js 16.2.10 + React 19.2.4 + TypeScript + Tailwind CSS v4 + MongoDB (Mongoose)

**Stack**: Next.js App Router, TypeScript, Mongoose ODM, bcryptjs, jsonwebtoken

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

## Environment

- `MONGODB_URI` required in `.env.local` (checked at runtime in `src/lib/db.ts`)
- Uses `.env.local` (gitignored) for local env
- Path alias: `@/*` → `./src/*` (tsconfig.json)

## Architecture Notes

- **Next.js 16** — breaking changes vs prior versions; read `node_modules/next/dist/docs/`
- **App Router** (`src/app/`) with API routes at `src/app/api/`
- **MongoDB via Mongoose** with connection caching in `src/lib/db.ts` (uses global cache for dev hot-reload)
- **Models** in `src/models/` (currently empty `MenuItem.ts`)
- **API routes** in `src/app/api/` (test endpoint at `/api/test`)

## Commands & Workflow

```bash
npm run lint        # run before commit
npm run build       # typechecks + builds
```

No test suite configured. No pre-commit hooks configured.

## Conventions

- Path alias `@/*` for `src/*` imports
- Mongoose connection cached on `global.mongoose` for dev hot-reload
- MONGODB_URI required in `.env.local` (throws at runtime if missing)
- ESLint: `eslint-config-next` core-web-vitals + typescript configs
- Tailwind v4 via PostCSS (`@tailwindcss/postcss`)

## Gotchas

- **Next.js 16 has breaking changes** — read docs in `node_modules/next/dist/docs/`
- MONGODB_URI must be set in `.env.local` (not `.env`) or app crashes at runtime
- No test framework configured
- No pre-commit / CI config present
- MenuItem model exists but is empty (`src/models/MenuItem.ts`)

## Project Structure

src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx ← Homepage
│ ├── menu/
│ │ └── page.tsx ← Menu page
│ ├── order/
│ │ └── page.tsx ← Cart + checkout
│ ├── booking/
│ │ └── page.tsx ← Room booking
│ ├── confirmation/
│ │ └── page.tsx ← Order/booking confirmed
│ └── admin/
│ ├── layout.tsx ← Admin shell (sidebar)
│ ├── page.tsx ← Dashboard
│ ├── login/
│ │ └── page.tsx
│ ├── menu/
│ │ └── page.tsx
│ ├── orders/
│ │ └── page.tsx
│ ├── bookings/
│ │ └── page.tsx
│ └── gallery/
│ └── page.tsx
│
├── components/
│ ├── layout/ ← Site-wide structure
│ │ ├── Navbar.tsx
│ │ └── Footer.tsx
│ │
│ ├── home/ ← Homepage sections
│ │ ├── HeroSection.tsx
│ │ ├── InfoBar.tsx ← Hours + address bar
│ │ ├── MenuPreview.tsx ← "Find and Get What You Love"
│ │ ├── RoomShowcase.tsx ← Room cards section
│ │ ├── OurStory.tsx ← Story + photo grid
│ │ └── LocationSection.tsx ← Map + contact + footer
│ │
│ ├── menu/ ← Menu page only
│ │ ├── MenuGrid.tsx
│ │ ├── MenuCard.tsx
│ │ ├── CategoryFilter.tsx
│ │ └── BottomSheet.tsx
│ │
│ ├── order/ ← Cart/order page only
│ │ ├── CartItem.tsx
│ │ ├── CartSummary.tsx
│ │ └── PickupTimePicker.tsx
│ │
│ ├── booking/ ← Booking page only
│ │ ├── RoomCard.tsx
│ │ ├── BookingForm.tsx
│ │ └── TimeSlotPicker.tsx
│ │
│ ├── ui/ ← Shared across all pages
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ ├── Badge.tsx
│ │ ├── LoadingSkeleton.tsx
│ │ └── EmptyState.tsx
│ │
│ └── admin/ ← CMS panel only
│ ├── StatsCard.tsx
│ ├── DataTable.tsx
│ └── StatusBadge.tsx
│
├── hooks/ ← Data fetching + logic
│ ├── useMenu.ts ← Fetch + filter menu items
│ ├── useCart.ts ← Cart operations
│ └── useBooking.ts ← Booking form state
│
├── store/ ← Global state
│ └── cartStore.ts ← Zustand cart
│
├── lib/ ← Utilities + DB
│ ├── db.ts
│ └── utils.ts ← Helper functions
│
├── models/ ← Mongoose schemas
│
└── types/ ← TypeScript interfaces
└── index.ts
