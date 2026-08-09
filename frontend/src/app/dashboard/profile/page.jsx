'use client';

import { useState } from 'react';
import API from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { User, Image as ImageIcon, Crown, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [updating, setUpdating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await API.put('/users/profile', { name, image });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleStripeUpgrade = async () => {
    try {
      setPurchasing(true);
      const res = await API.post('/payments/create-checkout-session', {
        type: 'premium',
        amount: 19.99,
      });

      if (res.data.success && res.data.url) {
        toast.success('Redirecting to Stripe Checkout API...');
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error('Stripe Checkout failed.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Personal Profile</h1>
        <p className="text-slate-500 text-sm">Update your public account profile & membership tier.</p>
      </div>

      {/* Premium Membership Status Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 border border-amber-500/30 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-xl">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {user?.isPremium ? 'PRO Premium Chef Account' : 'Standard Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {user?.isPremium
                  ? 'You have unlocked unlimited recipe additions & golden badge!'
                  : 'Limited to 2 recipes max. Upgrade to unlock unlimited additions.'}
              </p>
            </div>
          </div>

          {user?.isPremium ? (
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-black px-4 py-2 rounded-full flex items-center space-x-1 shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>ACTIVE PRO</span>
            </span>
          ) : (
            <button
              onClick={handleStripeUpgrade}
              disabled={purchasing}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all text-sm shrink-0"
            >
              {purchasing ? 'Redirecting...' : 'Upgrade to PRO ($19.99 via Stripe)'}
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleProfileUpdate}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
      >
        <div className="flex items-center space-x-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={image || user?.image}
            alt={name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-amber-500/20"
          />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{user?.name}</h4>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors text-sm"
        >
          {updating ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
