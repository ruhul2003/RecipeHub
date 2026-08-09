'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Utensils, Heart, ThumbsUp, Crown, PlusCircle, ArrowRight } from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/users/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching dashboard analytics..." />;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Chef Portal
            </span>
            {user?.isPremium && (
              <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>PRO CHEF</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Welcome back, {user?.name}!</h1>
          <p className="text-amber-100 text-sm max-w-xl">
            Track your recipe stats, saved culinary favorites, and community appreciations in real-time.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recipes</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalRecipes || 0}</h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Limit: {stats?.recipeLimit}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Favorites</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalFavorites || 0}</h3>
            <p className="text-xs text-rose-500 font-semibold mt-0.5">Saved Dishes</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Likes Received</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalLikesReceived || 0}</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-0.5">Community Praise</p>
          </div>
        </div>
      </div>

      {/* Non-Premium Upgrade Banner */}
      {!user?.isPremium && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Recipe Addition Cap Warning
            </span>
            <h3 className="text-2xl font-extrabold">You are on the Free Plan (2 Recipes Max)</h3>
            <p className="text-xs text-slate-400 max-w-lg">
              You have added {stats?.totalRecipes} of 2 allowed recipes. Upgrade to Premium for just $19.99 to publish unlimited dishes & earn a gold PRO badge!
            </p>
          </div>

          <Link
            href="/dashboard/profile"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 shrink-0 text-sm"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Upgrade to Premium</span>
          </Link>
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/dashboard/add-recipe"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Add New Recipe
              </h4>
              <p className="text-xs text-slate-400">Share your latest dish with the world.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/recipes"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Browse Community Recipes
              </h4>
              <p className="text-xs text-slate-400">Find new cooking ideas.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
