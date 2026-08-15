const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const { verifyToken } = require('../middleware/auth');

// @route PUT /api/users/profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, image } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        isBlocked: user.isBlocked,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
});

// @route GET /api/users/dashboard-stats
router.get('/dashboard-stats', verifyToken, async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments({ authorId: req.user._id });
    const totalFavorites = await Favorite.countDocuments({ userId: req.user._id });

    const userRecipes = await Recipe.find({ authorId: req.user._id });
    const totalLikesReceived = userRecipes.reduce((sum, r) => sum + (r.likesCount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalRecipes,
        totalFavorites,
        totalLikesReceived,
        isPremium: req.user.isPremium,
        recipeLimit: req.user.isPremium ? 'Unlimited' : 2,
        remainingRecipes: req.user.isPremium ? 'Unlimited' : Math.max(0, 2 - totalRecipes),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user dashboard stats', error: error.message });
  }
});

module.exports = router;
