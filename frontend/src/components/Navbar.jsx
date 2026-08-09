'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Utensils, Menu, X, Crown, User, LogOut, LayoutDashboard, Heart, Bookmark, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
              RecipeHub
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/recipes"
              className={`text-sm font-semibold transition-colors ${
                isActive('/recipes')
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Browse Recipes
            </Link>

            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center space-x-3 focus:outline-none p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 hidden lg:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                  {user.isPremium && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center shadow-sm">
                      <Crown className="w-3 h-3 mr-0.5 fill-current" />
                      PRO
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div
                    className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 text-slate-700 dark:text-slate-200"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 dark:hover:bg-slate-800/60 hover:text-amber-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard/add-recipe"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 dark:hover:bg-slate-800/60 hover:text-amber-600 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Recipe</span>
                    </Link>

                    <Link
                      href="/dashboard/my-recipes"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 dark:hover:bg-slate-800/60 hover:text-amber-600 transition-colors"
                    >
                      <Utensils className="w-4 h-4" />
                      <span>My Recipes</span>
                    </Link>

                    <Link
                      href="/dashboard/my-favorites"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 dark:hover:bg-slate-800/60 hover:text-amber-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Favorites</span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 dark:hover:bg-slate-800/60 hover:text-amber-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800/60 transition-colors border-t border-slate-100 dark:border-slate-800"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-700 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 dark:text-slate-200"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700 dark:text-slate-200"
          >
            Browse Recipes
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-base font-semibold text-amber-600 dark:text-amber-400"
              >
                User Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-bold text-amber-500"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="block py-2 text-base font-semibold text-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 font-bold text-white bg-amber-500 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
