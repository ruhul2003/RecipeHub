import { Utensils } from 'lucide-react';

export default function LoadingSpinner({ text = 'Preparing delicious recipes...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-amber-500">
          <Utensils className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}
