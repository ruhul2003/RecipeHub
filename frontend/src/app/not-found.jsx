import Link from 'next/link';
import { Home, Compass, ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Illustration & Graphics */}
      <div className="relative mb-8">
        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <ChefHat className="w-20 h-20 text-amber-500 animate-bounce" />
        </div>
        <span className="absolute -top-2 -right-2 text-7xl font-black text-amber-500/30">404</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
        Oops! Recipe Not Found
      </h1>

      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 text-base">
        It looks like the culinary creation you were searching for has been devoured or moved to another kitchen route!
      </p>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          href="/"
          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/recipes"
          className="w-full sm:w-auto bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-8 py-3.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
        >
          <Compass className="w-5 h-5" />
          <span>Explore Recipes</span>
        </Link>
      </div>
    </div>
  );
}
