'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Home, Compass, Search, LayoutDashboard, Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/recipes');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Floating 404 Graphic Badge */}
        <div className="relative inline-block">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse" />
          </div>
          <span className="absolute -bottom-3 -right-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-amber-500 tracking-wider">
            404 ERROR
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kitchen Route Missing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Dish Not Found on Our Menu
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto font-medium">
            Looks like the recipe or page you were looking for has been devoured, renamed, or cooked in another kitchen!
          </p>
        </div>

        {/* Search Bar for Direct Navigation */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search recipes (e.g. Pasta, Tacos, Ramen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xl text-sm font-medium transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 rounded-xl flex items-center space-x-1 transition-colors"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/recipes"
            className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-amber-500 font-extrabold px-8 py-4 rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] text-sm"
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Browse Recipes</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
