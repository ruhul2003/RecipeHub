# RecipeHub — Full-Stack Recipe Sharing & Culinary Platform

RecipeHub is a full-stack recipe sharing platform built with Next.js (App Router), React, Tailwind CSS, Framer Motion, MongoDB, Express, and Stripe Checkout API.

---

## 🌟 What's New & Highlighted Features

### 1. ⭐ Community Reviews & 5-Star Rating System
- Dynamic 5-star rating selector and feedback form on recipe details.
- Real-time recalculation of average ratings and total ratings count.
- Community reviews feed with user avatars, timestamps, star badges, and author delete actions.
- Recipe cards and preview modals dynamically reflect star ratings.

### 2. 👥 Interactive Recipe Serving Size Scaler
- Dynamic serving multiplier (0.5x, 1x, 2x, 3x, etc.) with instant reset.
- Intelligently parses whole numbers, fractions (e.g. `1/2`, `3/4`), and mixed numbers (`1 1/2`) to recalculate ingredient quantities in real time.

### 3. ⏱️ Smart Kitchen Companion Cooking Timer
- Countdown kitchen timer with presets (1m, 5m, 10m, 15m, 20m) and pause/resume functionality.
- Synthesized Web Audio API completion tone alert (no external audio files required).
- Accessible directly from recipe preparation steps.

### 4. 🛒 Interactive Grocery & Shopping Checklist
- Slide-over checklist drawer accessible from both the navigation bar and individual recipe ingredients.
- "Add All to Shopping Checklist" one-click action from recipe detail pages.
- Persistent checklist via `localStorage` with check-off, single-item deletion, clear-completed, and copy-to-clipboard formatting.

### 5. 🖨️ Kitchen-Friendly Print & PDF Mode
- One-click "Print" button on recipe pages.
- Dedicated `@media print` stylesheet that removes navigation, buttons, and sidebars, delivering a clean black-and-white recipe sheet for paper or PDF export.

### 6. 🍲 Related Recipes Recommendation Engine
- Smart recommendation endpoint (`/api/recipes/:id/related`) identifying similar dishes based on category and cuisine.
- Grid showcase at the bottom of recipe details for extended culinary discovery.

### 7. 🔍 Multi-Dimensional Filtering & Sorting
- **Difficulty Filter**: Filter by Easy, Medium, or Hard.
- **Max Preparation Time**: Quick-filter by `< 15 mins`, `< 30 mins`, `< 45 mins`, `< 60 mins`.
- **Sorting Options**: Sort by Newest First, Most Popular, Highest Rated, or Quickest to Cook.
- **Category Filter**: Multi-select category filtering using MongoDB `$in` operators.

### 8. 🥗 Dietary & Health Badges
- Dietary classification options: Vegetarian, Vegan, Gluten-Free, High-Protein, Keto, Dairy-Free, Low-Carb.
- Form inputs in recipe creation with dietary badges rendered on cards and previews.

### 9. ✨ Quick Preview Modal
- Browse catalog recipes and preview ingredients and cooking instructions without leaving search results.

---

## 🚀 Running Locally

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

---

## 🔐 Environment Variables (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Key for JWT signing
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe payment API keys
- `NEXT_PUBLIC_API_URL`: Backend API endpoint (`http://localhost:5000/api`)
