'use client';

import { useState, useEffect } from 'react';
import API from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Utensils, Edit3, Trash2, Heart, Clock, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recipes/my-recipes');
      if (res.data.success) {
        setRecipes(res.data.recipes);
      }
    } catch (err) {
      toast.error('Failed to load user recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const res = await API.delete(`/recipes/${id}`);
      if (res.data.success) {
        toast.success('Recipe deleted successfully.');
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await API.put(`/recipes/${editingRecipe._id}`, editingRecipe);
      if (res.data.success) {
        toast.success('Recipe updated successfully!');
        setEditingRecipe(null);
        fetchMyRecipes();
      }
    } catch (err) {
      toast.error('Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your published recipes..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Published Recipes</h1>
        <p className="text-slate-500 text-sm">Manage, update, or remove your created recipes.</p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Utensils className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Recipes Published Yet</h3>
          <p className="text-slate-500 text-sm">Create your first recipe to share with food lovers.</p>
          <Link
            href="/dashboard/add-recipe"
            className="inline-block bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-amber-600 transition-colors shadow-md"
          >
            Add New Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-48">
                <img
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{recipe.preparationTime} mins</span>
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                    {recipe.recipeName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {recipe.cuisineType} Cuisine • {recipe.difficultyLevel} Level
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-rose-500 font-bold text-xs flex items-center space-x-1">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{recipe.likesCount || 0} Likes</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditingRecipe(recipe)}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-100 transition-colors"
                      title="Edit Recipe"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Delete Recipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingRecipe(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Edit Recipe</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Recipe Name</label>
                <input
                  type="text"
                  required
                  value={editingRecipe.recipeName}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeName: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingRecipe.recipeImage}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeImage: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingRecipe.category}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    required
                    value={editingRecipe.preparationTime}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, preparationTime: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={editingRecipe.instructions}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-medium"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="w-1/2 py-3 rounded-2xl font-bold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-1/2 py-3 rounded-2xl font-bold bg-amber-500 text-white shadow-lg"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
