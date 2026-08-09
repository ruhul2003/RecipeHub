'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Users, Utensils, Crown, ShieldAlert, DollarSign, ArrowRight } from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/overview');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  if (loading) return <LoadingSpinner text="Loading platform administration analytics..." />;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Console
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Platform Admin Overview</h1>
        <p className="text-slate-500 text-sm">Monitor platform growth, recipe moderation, and transactions.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Users</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        {/* Recipes */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Recipes</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalRecipes || 0}</h3>
          </div>
        </div>

        {/* Premium */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">PRO Members</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalPremiumMembers || 0}</h3>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Reports</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalReports || 0}</h3>
          </div>
        </div>
      </div>

      {/* Admin Action Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Manage Users
              </h4>
              <p className="text-xs text-slate-400">View users & toggle block status.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/recipes"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Manage Recipes
              </h4>
              <p className="text-xs text-slate-400">Feature recipes on home page or delete.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/reports"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Recipe Reports
              </h4>
              <p className="text-xs text-slate-400">Review reported recipes & resolve.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Stripe Transactions
              </h4>
              <p className="text-xs text-slate-400">View user payments history.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
