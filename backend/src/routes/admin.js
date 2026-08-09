const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Report = require('../models/Report');
const Payment = require('../models/Payment');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(verifyToken, verifyAdmin);

// @route GET /api/admin/overview
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments({ status: 'active' });
    const totalPremiumMembers = await User.countDocuments({ isPremium: true });
    const totalReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRecipes,
        totalPremiumMembers,
        totalReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin overview stats', error: error.message });
  }
});

// @route GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users list', error: error.message });
  }
});

// @route PATCH /api/admin/users/:id/block-toggle
router.patch('/users/:id/block-toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an admin user.' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      isBlocked: user.isBlocked,
      message: user.isBlocked ? `User ${user.name} has been blocked.` : `User ${user.name} has been unblocked.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle block status', error: error.message });
  }
});

// @route GET /api/admin/recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch all recipes', error: error.message });
  }
});

// @route PATCH /api/admin/recipes/:id/feature-toggle
router.patch('/recipes/:id/feature-toggle', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }

    recipe.isFeatured = !recipe.isFeatured;
    await recipe.save();

    res.json({
      success: true,
      isFeatured: recipe.isFeatured,
      message: recipe.isFeatured ? `Recipe added to Home Page featured section!` : `Recipe removed from featured section.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle featured status', error: error.message });
  }
});

// @route GET /api/admin/reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().populate('recipeId').sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
  }
});

// @route PATCH /api/admin/reports/:id/dismiss
router.patch('/reports/:id/dismiss', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    report.status = 'dismissed';
    await report.save();

    res.json({ success: true, message: 'Report dismissed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to dismiss report', error: error.message });
  }
});

// @route DELETE /api/admin/reports/:id/remove-recipe
router.delete('/reports/:id/remove-recipe', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (report.recipeId) {
      await Recipe.findByIdAndDelete(report.recipeId);
    }

    report.status = 'resolved';
    await report.save();

    res.json({ success: true, message: 'Reported recipe removed and report resolved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove reported recipe', error: error.message });
  }
});

// @route GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Payment.find().sort({ paidAt: -1 });
    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
  }
});

module.exports = router;
