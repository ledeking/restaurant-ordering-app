# 🍽️ Restaurant Ordering App

A modern, full-stack restaurant ordering application built with Next.js 15, TypeScript, and PostgreSQL. Perfect for showcasing senior full-stack engineering skills with production-ready features like menu browsing, cart management, order processing, payment integration, and admin tools.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![Stripe](https://img.shields.io/badge/Stripe-17.3-635BFF)

## ✨ Features

### Customer Features
- 🏠 **Home Page** - Hero section with featured items, category carousel, and search
- 📋 **Menu Browsing** - Filter by category, search, sort by price/name
- 🍔 **Item Details** - Detailed view with images, descriptions, and variants
- 🛒 **Shopping Cart** - Persistent cart with localStorage sync, quantity management
- 💳 **Checkout Flow** - Multi-step checkout with address, delivery options, and Stripe payment
- 📦 **Order Tracking** - View order history and status updates
- 🔍 **Search** - Full-text search across menu items
- 🌙 **Dark Mode** - Full dark mode support with system preference detection

### Admin Features
- 📊 **Dashboard** - Overview with revenue stats, order counts, and recent orders
- 🍽️ **Menu Management** - Full CRUD for menu items with image uploads
- 📋 **Order Management** - View and update order statuses (pending, preparing, delivered, etc.)
- ⚙️ **Settings** - Restaurant configuration (extensible for future features)

### Technical Features
- 🔐 **Authentication** - Clerk.dev integration with role-based access (User/Admin)
- 💰 **Payments** - Stripe checkout sessions with webhook fulfillment
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🎨 **UI Components** - shadcn/ui component library
- 📱 **Responsive** - Mobile-first design inspired by UberEats/DoorDash
- ⚡ **Performance** - Server Components, Server Actions, Partial Prerendering
- 🔄 **Optimistic UI** - Instant cart updates and order status changes
- 🧪 **Type Safety** - Full TypeScript with strict mode

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, React Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Clerk.dev
- **Payments**: Stripe (Checkout Sessions, Webhooks)
- **State Management**: Zustand (cart, client-side state)
- **Forms**: react-hook-form + zod validation
- **Icons**: lucide-react
- **Notifications**: sonner (toast notifications)
- **Date Formatting**: date-fns

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud: Supabase/Neon/Vercel Postgres)
- Clerk.dev account (for authentication)
- Stripe account (for payments)
- Google Maps API key (optional, for address autocomplete)

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd restaurant-ordering-app
npm install
```

### Step 2: Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_ordering?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
restaurant-ordering-app/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public customer routes
│   │   ├── page.tsx         # Home page
│   │   ├── menu/            # Menu listing & details
│   │   ├── cart/             # Cart page
│   │   ├── checkout/         # Checkout flow
│   │   ├── orders/          # Order history
│   │   └── search/          # Search results
│   ├── (admin)/             # Protected admin routes
│   │   ├── admin/
│   │   │   ├── dashboard/   # Admin dashboard
│   │   │   ├── menu/        # Menu CRUD
│   │   │   ├── orders/      # Order management
│   │   │   └── settings/   # Settings
│   ├── api/                 # API routes
│   │   ├── webhooks/        # Stripe webhooks
│   │   └── categories/      # Categories API
│   └── layout.tsx           # Root layout
├── components/               # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (Navbar)
│   ├── menu/                # Menu components
│   ├── cart/                # Cart components
│   ├── checkout/            # Checkout components
│   └── admin/               # Admin components
├── lib/                     # Utilities & configurations
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # Auth utilities
│   ├── stripe.ts            # Stripe client
│   ├── utils.ts             # Helper functions
│   └── store/               # Zustand stores
├── actions/                 # Server Actions
│   ├── checkout.ts          # Checkout logic
│   ├── menu.ts              # Menu CRUD
│   └── orders.ts           # Order management
├── prisma/                  # Database
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts              # Seed script
├── middleware.ts            # Next.js middleware (auth)
└── public/                  # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel automatically:
- Detects Next.js
- Sets up build commands
- Configures serverless functions
- Handles database connections

### Database Options

- **Vercel Postgres**: Integrated with Vercel deployment
- **Supabase**: Free tier available, easy setup
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple PostgreSQL hosting

### Stripe Webhook Setup

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database
npm run db:generate  # Generate Prisma Client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📧 Support

- telegram: https://t.me/ledeking
- twitter:  https://x.com/ledeking_
