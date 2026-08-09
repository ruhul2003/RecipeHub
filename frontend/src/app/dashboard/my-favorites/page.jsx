'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Heart, Trash2, Eye, Clock, ChefHat } from 'lucide-react';

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await API.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites);
      }
    } catch (err) {
      toast.error('Failed to load favorite recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (favId) => {
    try {
      const res = await API.delete(`/favorites/${favId}`);
      if (res.data.success) {
        toast.success('Removed from favorites.');
        setFavorites((prev) => prev.filter((f) => f._id !== favId));
      }
    } catch (err) {
      toast.error('Remove failed.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading saved favorites..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Favorite Recipes</h1>
        <p className="text-slate-500 text-sm">Recipes you have bookmarked for easy cooking access.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Heart className="w-12 h-12 text-rose-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Favorite Recipes Saved</h3>
          <p className="text-slate-500 text-sm">Explore our recipes catalog and click the favorite button on any dish!</p>
          <Link
            href="/recipes"
            className="inline-block bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-amber-600 transition-colors shadow-md"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((fav) => {
            const recipe = fav.recipe;
            if (!recipe) return null;
            return (
              <div
                key={fav._id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44">
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center space-x-1">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Favorite</span>
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                      {recipe.recipeName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                      <span>{recipe.category}</span>
                      <span>•</span>
                      <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                      <span>{recipe.authorName}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{recipe.preparationTime} mins</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/recipes/${recipe._id}`}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>

                      <button
                        onClick={() => handleRemove(fav._id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Remove from Favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
