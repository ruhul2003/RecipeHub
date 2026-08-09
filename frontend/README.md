# RecipeHub — Recipe Sharing Platform (Client Side)

RecipeHub is a full-stack recipe sharing platform built with Next.js (App Router), React, Tailwind CSS, Framer Motion, MongoDB, and Stripe Checkout API.

## Features
- **Public Routes**: Home page (with Hero Banner, Dynamic Featured Recipes, Dynamic Popular Recipes, 2 Extra Static Sections, Framer Motion), Browse Recipes (MongoDB `$in` category filter & server-side pagination), Recipe Details (Like count/button, Stripe purchase, Favorite bookmarking, Report modal), Login, Register.
- **Authentication**: JWT authentication with HTTPOnly cookies, Credential Login, Google Login, password validation rules (minimum 6 characters, uppercase & lowercase).
- **User Dashboard**: Overview stats, Add Recipe (Enforces 2-recipe limit for standard users with Stripe upgrade prompt), My Recipes (View, edit, delete), My Favorites, My Purchases, Profile (Update name, image URL, upgrade to Premium PRO chef tier).
- **Admin Dashboard**: Overview stats, Manage Users (Block/unblock toggle), Manage Recipes (Homepage featured toggle & delete), Recipe Reports (Remove reported recipe / dismiss report), Stripe Payment Transactions list.
- **Dark / Light Theme Toggle**: Persistent mode switcher.
- **Responsive UI/UX**: Full device responsiveness, smooth loading states, custom 404 error page.

## Running Locally

### 1. Backend Server Setup
```bash
cd backend
npm install
npm run seed  # Seed initial admin & sample recipes
npm run dev   # Runs backend server on http://localhost:5000
```

### 2. Frontend App Setup
```bash
cd frontend
npm install
npm run dev   # Runs Next.js frontend on http://localhost:3000
```

## Environment Variables (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Key for JWT signing
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe payment API keys
- `NEXT_PUBLIC_API_URL`: Backend API endpoint (http://localhost:5000/api)
