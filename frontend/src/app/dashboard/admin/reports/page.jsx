'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ShieldAlert, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/reports');
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDismiss = async (reportId) => {
    try {
      const res = await API.patch(`/admin/reports/${reportId}/dismiss`);
      if (res.data.success) {
        toast.success('Report dismissed.');
        setReports((prev) =>
          prev.map((rep) => (rep._id === reportId ? { ...rep, status: 'dismissed' } : rep))
        );
      }
    } catch (err) {
      toast.error('Dismiss failed.');
    }
  };

  const handleRemoveRecipe = async (reportId) => {
    if (!confirm('Are you sure you want to delete the reported recipe permanently?')) return;
    try {
      const res = await API.delete(`/admin/reports/${reportId}/remove-recipe`);
      if (res.data.success) {
        toast.success('Reported recipe removed.');
        setReports((prev) =>
          prev.map((rep) => (rep._id === reportId ? { ...rep, status: 'resolved' } : rep))
        );
      }
    } catch (err) {
      toast.error('Recipe removal failed.');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching community reports..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Recipe Reports & Moderation</h1>
        <p className="text-slate-500 text-sm">Review reported dishes (Spam, Offensive Content, Copyright Issue).</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Recipe Name</th>
                <th className="py-4 px-6">Report Reason</th>
                <th className="py-4 px-6">Reporter Email</th>
                <th className="py-4 px-6">Report Status</th>
                <th className="py-4 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              {reports.map((rep) => (
                <tr key={rep._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    {rep.recipeName || 'Recipe Item'}
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                      {rep.reason}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500 font-mono">{rep.reporterEmail}</td>

                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                        rep.status === 'pending'
                          ? 'bg-amber-100 text-amber-600'
                          : rep.status === 'dismissed'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    {rep.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRemoveRecipe(rep._id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Recipe</span>
                        </button>
                        <button
                          onClick={() => handleDismiss(rep._id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
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
