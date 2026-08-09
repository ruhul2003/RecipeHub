'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Filter, ChevronLeft, ChevronRight, Utensils, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Italian', 'Asian', 'Breakfast', 'Bakery', 'Dessert', 'Mexican', 'American', 'Thai'];

function RecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync state from URL search params
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategories(catParam.split(','));
    }
  }, [searchParams]);

  // Fetch recipes with pagination & category filtering ($in)
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 9);

        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories.join(','));
        }

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const res = await API.get(`/recipes?${params.toString()}`);
        if (res.data.success) {
          setRecipes(res.data.recipes);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Fetch recipes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page, selectedCategories, searchTerm]);

  const toggleCategory = (category) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-amber-500 text-xs font-black uppercase tracking-wider">
          Explore Culinary Secrets
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Browse All Recipes
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Filter through hundreds of gourmet dishes using category tags, cuisine types, or keywords.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipe name, ingredient, cuisine..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
            />
          </div>

          {/* Clear Filters */}
          {(selectedCategories.length > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 px-4 py-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl transition-colors whitespace-nowrap"
            >
              Clear Filters ({selectedCategories.length + (searchTerm ? 1 : 0)})
            </button>
          )}
        </div>

        {/* MongoDB $in Category Checkbox Filter Bar */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Category Filter (MongoDB $in multi-select):</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p className="font-semibold">
          Showing <span className="text-slate-900 dark:text-white font-bold">{recipes.length}</span> of{' '}
          <span className="text-slate-900 dark:text-white font-bold">{totalCount}</span> recipes
        </p>
        <p className="text-xs">Page {page} of {totalPages}</p>
      </div>

      {/* Recipes Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching recipes catalog..." />
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Utensils className="w-12 h-12 text-amber-500 mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Recipes Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Try resetting your category filters or search keywords to explore more dishes.
          </p>
          <button
            onClick={clearFilters}
            className="bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-amber-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={recipe._id} recipe={recipe} index={idx} />
          ))}
        </div>
      )}

      {/* Server-Side Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-11 h-11 rounded-2xl font-bold text-sm transition-all ${
                page === p
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseRecipesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading recipes page..." />}>
      <RecipesContent />
    </Suspense>
  );
}
