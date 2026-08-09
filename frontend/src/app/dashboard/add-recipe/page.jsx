'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { PlusCircle, Image as ImageIcon, Utensils, Clock, Tag, Award, AlertTriangle, Crown, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Italian', 'Asian', 'Breakfast', 'Bakery', 'Dessert', 'Mexican', 'American', 'Thai', 'Seafood'];
const CUISINES = ['Italian', 'French', 'Japanese', 'Chinese', 'Mexican', 'Indian', 'American', 'Thai', 'Mediterranean'];

export default function AddRecipePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipeName, setRecipeName] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [category, setCategory] = useState('Italian');
  const [cuisineType, setCuisineType] = useState('Italian');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [preparationTime, setPreparationTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  // Pre-check recipe count for non-premium user
  useEffect(() => {
    const checkCount = async () => {
      if (user && !user.isPremium && user.role !== 'admin') {
        try {
          const res = await API.get('/recipes/my-recipes');
          if (res.data.success && res.data.count >= 2) {
            setLimitReached(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkCount();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (limitReached) {
      toast.error('You have reached the maximum 2-recipe limit for standard users!');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/recipes', {
        recipeName,
        recipeImage,
        category,
        cuisineType,
        difficultyLevel,
        preparationTime,
        ingredients,
        instructions,
      });

      if (res.data.success) {
        toast.success('Recipe published successfully! 🎉');
        router.push('/dashboard/my-recipes');
      }
    } catch (err) {
      if (err.response?.data?.isLimitReached) {
        setLimitReached(true);
        toast.error(err.response.data.message);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create recipe.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Publish New Recipe</h1>
        <p className="text-slate-500 text-sm">Fill in the details below to share your dish with RecipeHub.</p>
      </div>

      {/* 2-Recipe Limit Reached Alert Banner */}
      {limitReached && (
        <div className="bg-amber-500/10 border-2 border-amber-500 text-amber-700 dark:text-amber-300 p-6 rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Maximum Recipe Limit Reached (2/2)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Standard members can add up to 2 recipes. Become a Premium Member to unlock unlimited recipe posts & receive a gold PRO profile badge!
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard/profile')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-3.5 rounded-2xl shadow-md hover:scale-[1.01] transition-all text-sm flex items-center justify-center space-x-2"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Unlock Unlimited Recipes ($19.99 Premium)</span>
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 ${
          limitReached ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Recipe Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Recipe Name *
            </label>
            <div className="relative">
              <Utensils className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Creamy Truffle Pasta Tagliatelle"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          {/* Recipe Image URL / ImgBB Upload */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Recipe Image URL (Unsplash or ImgBB Direct Link) *
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={recipeImage}
                onChange={(e) => setRecipeImage(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisine Type */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Cuisine Type *
            </label>
            <select
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            >
              {CUISINES.map((cui) => (
                <option key={cui} value={cui}>
                  {cui}
                </option>
              ))}
            </select>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Preparation Time (Minutes) *
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="number"
                required
                min="1"
                placeholder="25"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Ingredients (One per line) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Ingredients List (Enter one ingredient per line) *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tagliatelle pasta&#10;Heavy cream&#10;Truffle oil&#10;Parmigiano-Reggiano"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            />
          </div>

          {/* Cooking Instructions */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Step-by-Step Instructions *
            </label>
            <textarea
              required
              rows={6}
              placeholder="1. Cook pasta in boiling salted water...&#10;2. Heat pan and melt butter..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || limitReached}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{loading ? 'Publishing...' : 'Publish Recipe'}</span>
        </button>
      </form>
    </div>
  );
}
