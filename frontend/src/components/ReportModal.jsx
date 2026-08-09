'use client';

import { useState } from 'react';
import API from '@/lib/api';
import toast from 'react-hot-toast';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ recipeId, recipeName, isOpen, onClose }) {
  const [reason, setReason] = useState('Spam');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await API.post(`/recipes/${recipeId}/report`, { reason });
      if (res.data.success) {
        toast.success('Report submitted successfully to platform administrators.');
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Report Recipe</h3>
            <p className="text-xs text-slate-500 truncate max-w-[240px]">{recipeName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Reason for Reporting
            </label>

            <div className="space-y-3">
              {['Spam', 'Offensive Content', 'Copyright Issue'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    reason === option
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="reason"
                      value={option}
                      checked={reason === option}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-rose-500 w-4 h-4"
                    />
                    <span>{option}</span>
                  </div>
                  {reason === option && <CheckCircle2 className="w-5 h-5 text-rose-500" />}
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
