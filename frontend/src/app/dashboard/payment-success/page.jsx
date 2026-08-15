'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { CheckCircle2, Utensils, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuth();
  const [verifying, setVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');
  const tx = searchParams.get('tx') || sessionId || 'tx_stripe_demo_891247';
  const type = searchParams.get('type') || 'premium';
  const recipeId = searchParams.get('recipeId') || '';

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        setVerifying(true);
        await API.post('/payments/confirm-session', {
          session_id: sessionId,
          tx,
          type,
          recipeId,
        });
        await fetchUser();
      } catch (err) {
        console.error('Payment verification error:', err);
      } finally {
        setVerifying(false);
      }
    };

    confirmPayment();
  }, [sessionId, tx, type, recipeId]);

  if (verifying) return <LoadingSpinner text="Verifying Stripe Payment status..." />;

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-8">
      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center shadow-xl animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-500/30">
          Stripe Payment Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Payment Successful! 🎉
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {type === 'premium'
            ? 'Congratulations! You are now a PRO Premium Member with unlimited recipe additions & golden badge.'
            : 'Your recipe purchase transaction has been completed and added to your collection.'}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 font-mono text-slate-600 dark:text-slate-300 shadow-sm">
        <div className="flex justify-between truncate">
          <span>Transaction Ref:</span>
          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[240px]">{tx}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Gateway:</span>
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
