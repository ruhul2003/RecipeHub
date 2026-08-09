'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Heart, ChefHat, Tag, ArrowRight, Sparkles } from 'lucide-react';

export default function RecipeCard({ recipe, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <span className="bg-amber-500/90 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
            {recipe.category}
          </span>
          {recipe.isFeatured && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Prep Time Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{recipe.preparationTime} mins</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-400 mb-1">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>{recipe.cuisineType} Cuisine</span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400">{recipe.difficultyLevel || 'Medium'}</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {recipe.recipeName}
          </h3>
        </div>

        {/* Card Footer Info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <ChefHat className="w-4 h-4 text-amber-500" />
            <span className="truncate max-w-[120px]">{recipe.authorName}</span>
          </div>

          <div className="flex items-center space-x-1 text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
            <Heart className="w-4 h-4 fill-current" />
            <span>{recipe.likesCount || 0}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/recipes/${recipe._id}`}
          className="w-full mt-2 bg-slate-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-slate-800 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-sm group-hover:shadow-amber-500/20"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
