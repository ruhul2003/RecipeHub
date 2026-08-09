const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/auth');

// @route GET /api/favorites
router.get('/', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('recipeId')
      .sort({ addedAt: -1 });

    // Filter out deleted/null recipes
    const validFavorites = favorites
      .filter((fav) => fav.recipeId && fav.recipeId.status === 'active')
      .map((fav) => ({
        _id: fav._id,
        addedAt: fav.addedAt,
        recipe: fav.recipeId,
      }));

    res.json({ success: true, count: validFavorites.length, favorites: validFavorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites', error: error.message });
  }
});

// @route POST /api/favorites/toggle/:recipeId
router.post('/toggle/:recipeId', verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const existing = await Favorite.findOne({ userId: req.user._id, recipeId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ success: true, isFavorite: false, message: 'Removed from favorites.' });
    } else {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ success: false, message: 'Recipe not found.' });
      }

      await Favorite.create({
        userEmail: req.user.email,
        userId: req.user._id,
        recipeId,
      });

      return res.status(201).json({ success: true, isFavorite: true, message: 'Added to favorites!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update favorite', error: error.message });
  }
});

// @route DELETE /api/favorites/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const fav = await Favorite.findById(req.params.id);
    if (!fav) {
      return res.status(404).json({ success: false, message: 'Favorite entry not found.' });
    }

    if (fav.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Favorite removed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite', error: error.message });
  }
});

module.exports = router;
