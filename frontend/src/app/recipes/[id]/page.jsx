'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ReportModal from '@/components/ReportModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  Heart,
  Bookmark,
  ShieldAlert,
  ShoppingCart,
  Clock,
  ChefHat,
  Tag,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Share2,
  Utensils,
} from 'lucide-react';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/recipes/${id}`);
        if (res.data.success) {
          const fetchedRecipe = res.data.recipe;
          setRecipe(fetchedRecipe);
          setLikesCount(fetchedRecipe.likesCount || 0);

          if (user) {
            setHasLiked(fetchedRecipe.likedBy?.includes(user.email));

            // Check favorite status
            const favRes = await API.get('/favorites');
            if (favRes.data.success) {
              const isFav = favRes.data.favorites.some(
                (f) => f.recipe._id === fetchedRecipe._id
              );
              setIsFavorite(isFav);
            }
          }
        }
      } catch (err) {
        toast.error('Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like recipes.');
      return router.push('/login');
    }

    try {
      const res = await API.post(`/recipes/${id}/like`);
      if (res.data.success) {
        setLikesCount(res.data.likesCount);
        setHasLiked(res.data.hasLiked);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Like failed.');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to favorite recipes.');
      return router.push('/login');
    }

    try {
      const res = await API.post(`/favorites/toggle/${id}`);
      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Favorite action failed.');
    }
  };

  const handleStripePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase recipe access.');
      return router.push('/login');
    }

    try {
      setPurchasing(true);
      const res = await API.post('/payments/create-checkout-session', {
        type: 'recipe',
        recipeId: id,
        amount: 4.99,
      });

      if (res.data.success && res.data.url) {
        toast.success('Redirecting to Stripe payment gateway...');
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error('Purchase initiation failed.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing dish details..." />;
  if (!recipe) return <div className="text-center py-20">Recipe not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Navigation Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recipes</span>
      </button>

      {/* Main Header & Image Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Recipe Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={recipe.recipeImage}
            alt={recipe.recipeName}
            className="w-full h-[400px] sm:h-[480px] object-cover"
          />
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className="bg-amber-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg">
              {recipe.category}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full">
              {recipe.cuisineType} Cuisine
            </span>
          </div>
        </div>

        {/* Recipe Overview Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{recipe.preparationTime} Minutes Preparation</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                {recipe.difficultyLevel} Level
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {recipe.recipeName}
            </h1>
          </div>

          {/* Author Card */}
          <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-lg">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Recipe Author</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{recipe.authorName}</p>
            </div>
          </div>

          {/* Action Control Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`p-3.5 rounded-2xl font-bold text-sm flex flex-col items-center justify-center space-y-1 transition-all ${
                hasLiked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteToggle}
              className={`p-3.5 rounded-2xl font-bold text-sm flex flex-col items-center justify-center space-y-1 transition-all ${
                isFavorite
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 hover:bg-amber-100'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>

            {/* Report Button */}
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please login to report recipes.');
                  return router.push('/login');
                }
                setIsReportOpen(true);
              }}
              className="p-3.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 flex flex-col items-center justify-center space-y-1 transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Report</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Recipe link copied to clipboard!');
              }}
              className="p-3.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 flex flex-col items-center justify-center space-y-1 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Stripe Purchase Button */}
          <div className="pt-4">
            <button
              onClick={handleStripePurchase}
              disabled={purchasing}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-3 text-base transition-all hover:scale-[1.02]"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{purchasing ? 'Processing Stripe Checkout...' : 'Buy Recipe Access ($4.99 via Stripe)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Tabs: Ingredients & Cooking Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        {/* Ingredients Column */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-amber-500 font-extrabold text-xl">
            <Utensils className="w-6 h-6" />
            <h3>Fresh Ingredients</h3>
          </div>

          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cooking Instructions Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-amber-500 font-extrabold text-xl">
            <Sparkles className="w-6 h-6" />
            <h3>Preparation & Cooking Steps</h3>
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            {recipe.instructions}
          </div>
        </div>
      </div>

      {/* Report Modal Component */}
      <ReportModal
        recipeId={recipe._id}
        recipeName={recipe.recipeName}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
