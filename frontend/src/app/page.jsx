'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import API from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Utensils,
  Sparkles,
  Heart,
  ChefHat,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

export default function HomePage() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, popRes] = await Promise.all([
          API.get('/recipes/featured'),
          API.get('/recipes/popular'),
        ]);
        if (featRes.data.success) setFeaturedRecipes(featRes.data.recipes);
        if (popRes.data.success) setPopularRecipes(popRes.data.recipes);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO BANNER SECTION (Framer Motion Animated) */}
      <section className="relative pt-12 lg:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>The World's Finest Culinary Hub</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              Unleash Your Inner Chef with{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                RecipeHub
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover artisan recipes, share your secret signature dishes with food lovers worldwide, and elevate your cooking experience with our global culinary community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                href="/recipes"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center justify-center space-x-3 text-base"
              >
                <span>Explore Recipes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-500 font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 text-base shadow-sm"
              >
                <ChefHat className="w-5 h-5 text-amber-500" />
                <span>Join Community</span>
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">10K+</p>
                <p className="text-xs text-slate-500 font-medium">Recipes Shared</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">50K+</p>
                <p className="text-xs text-slate-500 font-medium">Food Enthusiasts</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-500">4.9★</p>
                <p className="text-xs text-slate-500 font-medium">Community Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Banner Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="Culinary Feast"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-2">
                  <span className="bg-amber-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Chef's Choice
                  </span>
                  <h3 className="text-2xl font-bold">Pan-Seared Salmon with Herb Reduction</h3>
                  <p className="text-xs text-slate-300">Prepared by Chef Sophia Laurent • 25 Mins</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-3"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Community Loves</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">1,400+ Likes This Week</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED RECIPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-amber-500 text-xs font-black uppercase tracking-wider flex items-center space-x-1 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Selections</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Featured Recipes
            </h2>
          </div>
          <Link
            href="/recipes"
            className="mt-4 md:mt-0 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center space-x-1"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured recipes..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: POPULAR RECIPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/50 py-16 rounded-3xl border border-slate-200/50 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-rose-500 text-xs font-black uppercase tracking-wider flex items-center space-x-1 mb-2">
              <Heart className="w-4 h-4 fill-current" />
              <span>Community Favorites</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Most Popular Recipes
            </h2>
          </div>
          <Link
            href="/recipes"
            className="mt-4 md:mt-0 text-sm font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1"
          >
            <span>Browse Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching popular dishes..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRecipes.map((recipe, idx) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* 4. EXTRA STATIC SECTION 1: CULINARY CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-amber-500 text-xs font-black uppercase tracking-wider">
            Explore Flavors
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Discover Recipes by Cuisine & Category
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select from world-renowned cuisines crafted with passion and fresh ingredients.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Italian', icon: '🍕', count: '450+ Recipes', cat: 'Italian' },
            { name: 'Asian', icon: '🍜', count: '380+ Recipes', cat: 'Asian' },
            { name: 'Breakfast', icon: '🥞', count: '290+ Recipes', cat: 'Breakfast' },
            { name: 'Bakery', icon: '🥐', count: '210+ Recipes', cat: 'Bakery' },
            { name: 'Dessert', icon: '🍰', count: '340+ Recipes', cat: 'Dessert' },
            { name: 'Mexican', icon: '🌮', count: '190+ Recipes', cat: 'Mexican' },
          ].map((item, index) => (
            <Link
              key={item.name}
              href={`/recipes?category=${item.cat}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-center hover:border-amber-500 hover:shadow-xl transition-all group"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. EXTRA STATIC SECTION 2: WHY JOIN RECIPEHUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/30">
                Why Join Us
              </span>
              <h2 className="text-3xl sm:text-5xl font-black leading-tight">
                Empowering Home Chefs & Food Lovers Everywhere
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether you want to document family secret recipes, share culinary tips with thousands, or upgrade to a Premium Chef badge to unlock unlimited creations — RecipeHub provides everything you need.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Instant Publishing</h4>
                    <p className="text-xs text-slate-400">Publish recipes with high-res photos instantly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Verified Community</h4>
                    <p className="text-xs text-slate-400">Moderated recipe platform & community reviews.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Interactive Favorites</h4>
                    <p className="text-xs text-slate-400">Save dishes to your personal favorite collection.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Stripe Premium Badge</h4>
                    <p className="text-xs text-slate-400">Unlock unlimited recipe additions with PRO badge.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/60 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-xl">
                  PRO
                </div>
                <div>
                  <h3 className="text-xl font-bold">Become a Premium Member</h3>
                  <p className="text-xs text-slate-400">Unlock unlimited recipe additions & gold chef badge.</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400">✓</span>
                  <span>Unlimited recipe publications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400">✓</span>
                  <span>Featured homepage placement priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400">✓</span>
                  <span>Golden Chef Profile Badge</span>
                </div>
              </div>

              <Link
                href="/dashboard/profile"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl block text-center shadow-lg transition-all"
              >
                Upgrade to Premium ($19.99)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
