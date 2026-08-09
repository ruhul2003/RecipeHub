'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Utensils, Mail, Lock, User, Image as ImageIcon, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time password validation criteria
  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isValidPassword = hasMinLen && hasUpper && hasLower;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidPassword) {
      setErrorMsg('Please fulfill all password requirements below.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, image);
    setLoading(false);
    if (res?.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Utensils className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500">Join RecipeHub to share your culinary art</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Chef Sophia Laurent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="sophia@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>

            {/* Password Validation Checklist */}
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
              <div className={`flex items-center space-x-2 ${hasMinLen ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>At least 6 characters</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasUpper ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasLower ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] pt-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-amber-500 font-extrabold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
