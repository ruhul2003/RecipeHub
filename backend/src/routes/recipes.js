const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Report = require('../models/Report');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// @route GET /api/recipes
// Supports: category, search, cuisine, difficulty, maxTime, dietaryTag, sortBy, page, limit, featured, popular
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      cuisine,
      difficulty,
      maxTime,
      dietaryTag,
      sortBy,
      page = 1,
      limit = 9,
      featured,
      popular,
    } = req.query;

    const query = { status: 'active' };

    // MongoDB $in Category filter implementation
    if (category) {
      const categoriesArray = category.split(',').map((c) => c.trim()).filter(Boolean);
      if (categoriesArray.length > 0) {
        query.category = { $in: categoriesArray.map(c => new RegExp(c, 'i')) };
      }
    }

    if (difficulty && difficulty !== 'all') {
      query.difficultyLevel = new RegExp(`^${difficulty}$`, 'i');
    }

    if (maxTime && !isNaN(Number(maxTime))) {
      query.preparationTime = { $lte: Number(maxTime) };
    }

    if (dietaryTag) {
      const tagsArray = dietaryTag.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagsArray.length > 0) {
        query.dietaryTags = { $in: tagsArray.map(t => new RegExp(t, 'i')) };
      }
    }

    if (search) {
      query.$or = [
        { recipeName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { cuisineType: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisineType = { $regex: cuisine, $options: 'i' };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'popular' || popular === 'true') {
      sort = { likesCount: -1, createdAt: -1 };
    } else if (sortBy === 'rating') {
      sort = { averageRating: -1, ratingsCount: -1, createdAt: -1 };
    } else if (sortBy === 'prepTimeAsc') {
      sort = { preparationTime: 1, createdAt: -1 };
    } else if (sortBy === 'prepTimeDesc') {
      sort = { preparationTime: -1, createdAt: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: recipes.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recipes', error: error.message });
  }
});

// @route GET /api/recipes/featured
router.get('/featured', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isFeatured: true, status: 'active' }).limit(6);
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured recipes', error: error.message });
  }
});

// @route GET /api/recipes/popular
router.get('/popular', async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'active' }).sort({ likesCount: -1 }).limit(6);
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch popular recipes', error: error.message });
  }
});

// @route GET /api/recipes/my-recipes
router.get('/my-recipes', verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user recipes', error: error.message });
  }
});

// @route GET /api/recipes/:id/related
// @desc Get related recipes based on category or cuisine
router.get('/:id/related', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.id);
    if (!currentRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    // Find recipes with matching category or cuisineType, excluding the current recipe
    let relatedRecipes = await Recipe.find({
      _id: { $ne: currentRecipe._id },
      status: 'active',
      $or: [
        { category: currentRecipe.category },
        { cuisineType: currentRecipe.cuisineType },
      ],
    })
      .sort({ likesCount: -1, averageRating: -1 })
      .limit(4);

    // If fewer than 4, find other popular active recipes to recommend
    if (relatedRecipes.length < 4) {
      const existingIds = [currentRecipe._id, ...relatedRecipes.map((r) => r._id)];
      const fillers = await Recipe.find({
        _id: { $nin: existingIds },
        status: 'active',
      })
        .sort({ likesCount: -1, createdAt: -1 })
        .limit(4 - relatedRecipes.length);

      relatedRecipes = [...relatedRecipes, ...fillers];
    }

    res.json({ success: true, count: relatedRecipes.length, recipes: relatedRecipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch related recipes', error: error.message });
  }
});

// @route GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recipe details', error: error.message });
  }
});

// @route POST /api/recipes (Enforces 2 recipes limit for normal users)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel,
      preparationTime,
      ingredients,
      instructions,
      dietaryTags,
      servings,
      calories,
    } = req.body;

    if (!recipeName || !recipeImage || !category || !cuisineType || !preparationTime || !ingredients || !instructions) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    // Check normal user recipe creation limit (Max 2 recipes)
    if (!req.user.isPremium && req.user.role !== 'admin') {
      const userRecipeCount = await Recipe.countDocuments({ authorId: req.user._id });
      if (userRecipeCount >= 2) {
        return res.status(403).json({
          success: false,
          isLimitReached: true,
          message: 'You have reached the maximum limit of 2 recipes for normal users. Please become a premium member to add unlimited recipes!',
        });
      }
    }

    const formattedIngredients = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split('\n').map((i) => i.trim()).filter(Boolean);

    const formattedTags = Array.isArray(dietaryTags)
      ? dietaryTags
      : typeof dietaryTags === 'string'
      ? dietaryTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const recipe = await Recipe.create({
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel: difficultyLevel || 'Medium',
      preparationTime: Number(preparationTime),
      ingredients: formattedIngredients,
      instructions,
      dietaryTags: formattedTags,
      servings: servings ? Number(servings) : 4,
      calories: calories ? Number(calories) : 0,
      authorId: req.user._id,
      authorName: req.user.name,
      authorEmail: req.user.email,
    });

    res.status(201).json({ success: true, message: 'Recipe published successfully!', recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create recipe', error: error.message });
  }
});

// @route PUT /api/recipes/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    // Author or admin check
    if (recipe.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this recipe.' });
    }

    const {
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel,
      preparationTime,
      ingredients,
      instructions,
      dietaryTags,
      servings,
      calories,
    } = req.body;

    if (recipeName) recipe.recipeName = recipeName;
    if (recipeImage) recipe.recipeImage = recipeImage;
    if (category) recipe.category = category;
    if (cuisineType) recipe.cuisineType = cuisineType;
    if (difficultyLevel) recipe.difficultyLevel = difficultyLevel;
    if (preparationTime) recipe.preparationTime = Number(preparationTime);
    if (ingredients) {
      recipe.ingredients = Array.isArray(ingredients)
        ? ingredients
        : ingredients.split('\n').map((i) => i.trim()).filter(Boolean);
    }
    if (instructions) recipe.instructions = instructions;
    if (dietaryTags !== undefined) {
      recipe.dietaryTags = Array.isArray(dietaryTags)
        ? dietaryTags
        : typeof dietaryTags === 'string'
        ? dietaryTags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }
    if (servings !== undefined) recipe.servings = Number(servings) || 4;
    if (calories !== undefined) recipe.calories = Number(calories) || 0;

    await recipe.save();
    res.json({ success: true, message: 'Recipe updated successfully!', recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update recipe', error: error.message });
  }
});

// @route DELETE /api/recipes/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    if (recipe.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this recipe.' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    // Also remove from favorites and reports
    await Favorite.deleteMany({ recipeId: req.params.id });
    await Report.deleteMany({ recipeId: req.params.id });

    res.json({ success: true, message: 'Recipe deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete recipe', error: error.message });
  }
});

// @route POST /api/recipes/:id/like
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    const userEmail = req.user.email;
    const hasLiked = recipe.likedBy.includes(userEmail);

    if (hasLiked) {
      recipe.likedBy = recipe.likedBy.filter((e) => e !== userEmail);
      recipe.likesCount = Math.max(0, recipe.likesCount - 1);
    } else {
      recipe.likedBy.push(userEmail);
      recipe.likesCount += 1;
    }

    await recipe.save();

    res.json({
      success: true,
      likesCount: recipe.likesCount,
      hasLiked: !hasLiked,
      message: !hasLiked ? 'Recipe liked!' : 'Recipe unliked.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like recipe', error: error.message });
  }
});

// @route POST /api/recipes/:id/report
router.post('/:id/report', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !['Spam', 'Offensive Content', 'Copyright Issue'].includes(reason)) {
      return res.status(400).json({ success: false, message: 'Please select a valid report reason.' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    const report = await Report.create({
      recipeId: recipe._id,
      recipeName: recipe.recipeName,
      reporterEmail: req.user.email,
      reason,
    });

    res.status(201).json({ success: true, message: 'Report submitted to admin for review.', report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to report recipe', error: error.message });
  }
});

module.exports = router;
