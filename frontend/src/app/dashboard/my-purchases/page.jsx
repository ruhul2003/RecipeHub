'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, Eye, Calendar, CheckCircle2 } from 'lucide-react';

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const res = await API.get('/payments/my-purchases');
        if (res.data.success) {
          setPurchases(res.data.payments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching your purchased recipe collection..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Purchased Recipes</h1>
        <p className="text-slate-500 text-sm">Gourmet chef recipes unlocked via Stripe Checkout payments.</p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <ShoppingCart className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Recipes Purchased Yet</h3>
          <p className="text-slate-500 text-sm">Purchase premium culinary guides directly from recipe details pages!</p>
          <Link
            href="/recipes"
            className="inline-block bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-amber-600 transition-colors shadow-md"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Recipe / Item</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Date Paid</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                {purchases.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      {item.recipeId ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.recipeId.recipeImage}
                            alt={item.recipeId.recipeName}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">{item.recipeId.recipeName}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-amber-500">PRO Premium Membership Unlock</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${item.amount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-slate-500">{item.transactionId}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(item.paidAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.recipeId && (
                        <Link
                          href={`/recipes/${item.recipeId._id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
