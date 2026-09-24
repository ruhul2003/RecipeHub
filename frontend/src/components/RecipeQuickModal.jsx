'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Clock, Star, Users, Flame, Utensils, ArrowRight, Tag } from 'lucide-react';

export default function RecipeQuickModal({ recipe, isOpen, onClose }) {
  if (!isOpen || !recipe) return null;

  const rating = recipe.averageRating ? Number(recipe.averageRating).toFixed(1) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-64 md:h-full min-h-[260px] overflow-hidden">
              <img
                src={recipe.recipeImage}
                alt={recipe.recipeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  {recipe.category}
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  {recipe.cuisineType}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.preparationTime} mins</span>
                  </span>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                    {recipe.difficultyLevel || 'Medium'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rating || 'New'}</span>
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {recipe.recipeName}
                </h3>

                {/* Dietary Tags */}
                {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.dietaryTags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Ingredients snippet */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Ingredients ({recipe.ingredients?.length || 0}):
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {recipe.ingredients?.slice(0, 4).map((ing, i) => (
                      <li key={i} className="truncate">{ing}</li>
                    ))}
                    {recipe.ingredients?.length > 4 && (
                      <li className="list-none text-slate-400 italic">
                        + {recipe.ingredients.length - 4} more ingredients...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/recipes/${recipe._id}`}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>View Full Recipe & Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
