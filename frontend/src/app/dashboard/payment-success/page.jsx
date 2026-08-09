'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Crown, Utensils, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuth();

  const tx = searchParams.get('tx') || 'tx_demo_891247';
  const type = searchParams.get('type') || 'premium';

  // Refresh user state so premium badge appears immediately
  fetchUser();

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-8">
      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center shadow-xl animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-500/30">
          Stripe Payment Verified
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Payment Successful! 🎉
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {type === 'premium'
            ? 'Congratulations! You are now a PRO Premium Member with unlimited recipe additions & golden badge.'
            : 'Your recipe purchase transaction has been completed and added to your collection.'}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 font-mono text-slate-600 dark:text-slate-300">
        <div className="flex justify-between">
          <span>Transaction ID:</span>
          <span className="font-bold text-slate-900 dark:text-white">{tx}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Provider:</span>
          <span>Stripe Checkout API</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="text-emerald-500 font-bold">COMPLETED</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href="/dashboard"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-colors shadow-md text-sm"
        >
          <Utensils className="w-4 h-4" />
          <span>Go to User Dashboard</span>
        </Link>
        <Link
          href="/dashboard/add-recipe"
          className="w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-colors text-sm"
        >
          <span>Add New Recipe</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Verifying payment..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
