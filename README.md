# SYVIC

Court-ready document packets and procedural checklists for Texas Justice Court workflows.

## Overview

SYVIC helps landlords and property managers prepare organized, court-ready document packets and procedural checklists for three Texas Justice Court workflows:

1. **Eviction (Forcible Detainer)** - Notice tracking, rent ledgers, lease agreements
2. **Repair and Remedy** - Habitability claims, repair requests, photo evidence
3. **Small Claims / Debt Claims** - Property damage, debt recovery, service documentation

**Important:** SYVIC provides procedural information and document organization tools only. It does not provide legal advice.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Deployment:** Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Stripe account (for billing features)
- Vercel account (for deployment)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd syvic
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. The database migrations have already been applied (check the migrations tab to verify)

If you need to re-apply migrations, they are structured as:
- `create_syvic_core_schema` - Organizations, members, subscriptions
- `create_properties_tenants_cases` - Properties, tenants, cases
- `create_case_files_timeline_templates` - Files, timeline, templates, leads

### 3. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Copy your publishable and secret keys (use test mode for development)
4. Create webhook endpoint (see Webhooks section below)

#### Creating Stripe Products and Prices

In Stripe Dashboard → Products:

1. Create "SYVIC Pro" product
   - Monthly price: $49
   - Copy the Price ID (starts with `price_`)

2. Create "SYVIC Team" product
   - Monthly price: $149
   - Copy the Price ID

### 4. Environment Variables

Create `.env.local` file in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_TEAM=price_xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SYVIC
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Build and Test

```bash
npm run build
npm run start
```

## Stripe Webhooks

Stripe webhooks are required for subscription management.

### Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env.local`

### Production (Vercel)

1. Deploy to Vercel (see Deployment section)
2. In Stripe Dashboard → Developers → Webhooks
3. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add to Vercel environment variables

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial SYVIC setup"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add all environment variables from `.env.local`
3. Deploy

### 3. Update Environment Variables

After first deployment, update:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Configure Stripe Webhook

See Stripe Webhooks → Production section above.

## Brand Assets

### Replacing Placeholder Logos

The app includes placeholder logos. To use your actual SYVIC brand assets:

1. Export your logos as SVG:
   - **Full logo:** 120×32px → `syvic-logo.svg`
   - **Logo mark:** 32×32px → `syvic-mark.svg`

2. Ensure text is converted to paths/outlines

3. Replace files in `/public/brand/`:
   ```
   /public/brand/syvic-logo.svg
   /public/brand/syvic-mark.svg
   ```

4. Clear browser cache and rebuild

5. Visit `/brand` page to preview logo placement

### Logo Usage

- **Header/Footer:** Full logo
- **Auth screens:** Full logo
- **Favicon:** Logo mark (convert to .ico or .png)

## Project Structure

```
├── app/
│   ├── (marketing)/         # Public pages
│   │   ├── page.tsx         # Landing page
│   │   ├── product/         # Product page
│   │   ├── pricing/         # Pricing page
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── blog/            # Blog/resources
│   │   ├── deadlines/       # Texas deadlines
│   │   ├── terms/           # Terms of Service
│   │   └── privacy/         # Privacy Policy
│   ├── login/               # Auth pages
│   ├── signup/
│   ├── dashboard/           # App pages
│   ├── cases/
│   ├── templates/
│   ├── settings/
│   ├── brand/               # Brand preview
│   └── api/
│       └── contact/         # Contact form API
├── components/
│   ├── ui/                  # shadcn components
│   ├── marketing-header.tsx
│   ├── marketing-footer.tsx
│   ├── app-header.tsx
│   ├── logo.tsx
│   └── container.tsx
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── auth/               # Auth actions
│   ├── types/              # TypeScript types
│   └── constants/          # Texas deadlines data
└── public/
    └── brand/              # Logo assets
```

## Database Schema

### Core Tables

- **organizations** - Property management companies/landlord businesses
- **organization_members** - User-organization relationships with roles
- **subscription_status** - Billing plans (free/pro/team)
- **properties** - Real estate properties
- **tenants** - Tenant information
- **cases** - Legal cases (eviction/repair_remedy/small_claims)
- **case_files** - Uploaded documents with exhibit numbering
- **case_timeline_events** - Chronological case events
- **templates** - System and user templates
- **leads** - Contact form submissions

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access data within their organizations.

## Features

### Implemented

- ✅ Complete marketing website (landing, product, pricing, about, contact, blog)
- ✅ User authentication (signup/login with email/password)
- ✅ Organization management with role-based access
- ✅ Dashboard with case overview
- ✅ Cases list and management
- ✅ Texas deadlines reference (public + in-app)
- ✅ Full black/white minimal design system
- ✅ Responsive layout for all screen sizes
- ✅ Brand asset management and preview
- ✅ Terms of Service and Privacy Policy pages

### Coming Soon

- Case creation workflow with property/tenant linking
- Case workspace with tabs (overview, documents, timeline, checklist, deadlines, packet builder)
- File upload with Supabase Storage and exhibit numbering
- Template system with JSON schemas and merge fields
- PDF packet generation (cover page, TOC, exhibits, timeline)
- Stripe billing integration (checkout, webhooks, customer portal)
- Organization settings and member management
- Subscription plan enforcement

## Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

## Environment Variables Reference

All required environment variables are documented in `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_ID_PRO` - Stripe Price ID for Pro plan
- `STRIPE_PRICE_ID_TEAM` - Stripe Price ID for Team plan
- `NEXT_PUBLIC_APP_URL` - Your app URL (for redirects and links)
- `NEXT_PUBLIC_APP_NAME` - App name (SYVIC)

## Support

For questions or issues:

1. Check the `/deadlines` page for Texas procedural information
2. Review the brand preview at `/brand`
3. Verify all environment variables are set correctly
4. Check Supabase logs for database issues
5. Check Stripe Dashboard for payment issues

## Legal Disclaimer

SYVIC provides procedural information and document organization tools only. This application does not constitute legal advice and should not be relied upon as a substitute for consultation with a licensed attorney. Always verify procedural requirements with legal counsel and the relevant court.

## License

Copyright © 2024 SYVIC. All rights reserved.
