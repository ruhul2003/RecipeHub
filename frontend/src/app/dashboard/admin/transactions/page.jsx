'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DollarSign, CheckCircle2 } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/transactions');
        if (res.data.success) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching Stripe payment logs..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Stripe Payment Transactions</h1>
        <p className="text-slate-500 text-sm">Full log of user payments, PRO memberships, and recipe purchases.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">User Email</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Date Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{tx.userEmail}</td>
                  <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${tx.amount?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs font-mono text-slate-500">{tx.transactionId}</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full flex items-center space-x-1 w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="uppercase">{tx.paymentStatus}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-slate-500">
                    {new Date(tx.paidAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
