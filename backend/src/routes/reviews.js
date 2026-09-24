const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/auth');

// Helper to recalculate and update recipe average rating
const updateRecipeRatingStats = async (recipeId) => {
  const reviews = await Review.find({ recipeId });
  const ratingsCount = reviews.length;
  const averageRating =
    ratingsCount > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / ratingsCount).toFixed(1))
      : 0;

  await Recipe.findByIdAndUpdate(recipeId, {
    averageRating,
    ratingsCount,
  });

  return { averageRating, ratingsCount };
};

// @route GET /api/reviews/recipe/:recipeId
// @desc Get all reviews for a recipe
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 });

    const ratingsCount = reviews.length;
    const averageRating =
      ratingsCount > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / ratingsCount).toFixed(1))
        : 0;

    res.json({
      success: true,
      count: ratingsCount,
      averageRating,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
});

// @route POST /api/reviews/recipe/:recipeId
// @desc Add or update review for a recipe
router.post('/recipe/:recipeId', verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment cannot be empty.' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    // Check if user already reviewed this recipe
    let review = await Review.findOne({ recipeId, userId: req.user._id });

    if (review) {
      review.rating = Number(rating);
      review.comment = comment.trim();
      review.userName = req.user.name;
      review.userImage = req.user.image || '';
      await review.save();
    } else {
      review = await Review.create({
        recipeId,
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        userImage: req.user.image || '',
        rating: Number(rating),
        comment: comment.trim(),
      });
    }

    const stats = await updateRecipeRatingStats(recipeId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
      ...stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
});

// @route DELETE /api/reviews/:id
// @desc Delete review (author or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this review.' });
    }

    const recipeId = review.recipeId;
    await Review.findByIdAndDelete(req.params.id);

    const stats = await updateRecipeRatingStats(recipeId);

    res.json({
      success: true,
      message: 'Review deleted successfully.',
      ...stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
});

module.exports = router;
