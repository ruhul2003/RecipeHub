'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  LayoutDashboard,
  PlusCircle,
  Utensils,
  Heart,
  ShoppingCart,
  User,
  Crown,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner text="Checking authentication status..." />;
  if (!user) return null;

  const isActive = (path) => pathname === path;

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Add Recipe', href: '/dashboard/add-recipe', icon: PlusCircle },
    { label: 'My Recipes', href: '/dashboard/my-recipes', icon: Utensils },
    { label: 'My Favorites', href: '/dashboard/my-favorites', icon: Heart },
    { label: 'Purchased Recipes', href: '/dashboard/my-purchases', icon: ShoppingCart },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar */}
        <aside className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* User Brief */}
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={user.image}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/40"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 dark:text-white truncate">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              {user.isPremium ? (
                <span className="inline-flex items-center space-x-1 mt-1 text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3 fill-current" />
                  <span>PREMIUM CHEF</span>
                </span>
              ) : (
                <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Standard Member (Max 2 Recipes)
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    active
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user.role === 'admin' && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/dashboard/admin"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                    pathname.startsWith('/dashboard/admin')
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  <Crown className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="lg:col-span-3 min-h-[600px]">{children}</main>
      </div>
    </div>
  );
}
