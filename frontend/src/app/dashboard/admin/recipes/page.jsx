'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Utensils, Sparkles, Trash2, Edit3, Heart, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/recipes');
      if (res.data.success) {
        setRecipes(res.data.recipes);
      }
    } catch (err) {
      toast.error('Failed to load admin recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const handleFeatureToggle = async (recipeId) => {
    try {
      const res = await API.patch(`/admin/recipes/${recipeId}/feature-toggle`);
      if (res.data.success) {
        toast.success(res.data.message);
        setRecipes((prev) =>
          prev.map((r) => (r._id === recipeId ? { ...r, isFeatured: res.data.isFeatured } : r))
        );
      }
    } catch (err) {
      toast.error('Feature action failed.');
    }
  };

  const handleDelete = async (recipeId) => {
    if (!confirm('Are you sure you want to permanently delete this recipe from RecipeHub?')) return;
    try {
      const res = await API.delete(`/recipes/${recipeId}`);
      if (res.data.success) {
        toast.success('Recipe removed permanently.');
        setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      }
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading recipe database..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Manage All Platform Recipes</h1>
        <p className="text-slate-500 text-sm">Feature recipes to Home page, edit details, or remove content.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Recipe</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              {recipes.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img src={r.recipeImage} alt={r.recipeName} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{r.recipeName}</p>
                        <p className="text-xs text-rose-500 font-semibold">{r.likesCount || 0} Likes</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {r.authorName}
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2.5 py-1 rounded-full">
                      {r.category}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleFeatureToggle(r._id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                        r.isFeatured
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{r.isFeatured ? 'Featured' : 'Add to Featured'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/recipes/${r._id}`}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
