const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/auth');

// @route POST /api/payments/create-checkout-session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    const { type, recipeId, amount } = req.body; // type: 'premium' or 'recipe'

    let priceAmount = amount ? Math.round(amount * 100) : 1999; // default $19.99 for premium
    let title = 'RecipeHub Premium Membership';
    let description = 'Unlock unlimited recipe creation & exclusive gold badge!';

    if (type === 'recipe' && recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (recipe) {
        title = `Purchase Recipe: ${recipe.recipeName}`;
        description = `Chef Recipe Access by ${recipe.authorName}`;
        priceAmount = 499; // $4.99 for recipe purchase
      }
    }

    // Generate mock transaction ID for Stripe demonstration compatibility
    const mockTxId = 'tx_stripe_' + Math.random().toString(36).substr(2, 9) + Date.now();

    // Create record directly or create checkout session URL
    const payment = await Payment.create({
      userEmail: req.user.email,
      userId: req.user._id,
      amount: priceAmount / 100,
      recipeId: type === 'recipe' ? recipeId : undefined,
      transactionId: mockTxId,
      paymentStatus: 'completed',
    });

    if (type === 'premium') {
      await User.findByIdAndUpdate(req.user._id, { isPremium: true });
    }

    res.json({
      success: true,
      url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/payment-success?tx=${mockTxId}&type=${type}`,
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stripe checkout creation failed', error: error.message });
  }
});

// @route GET /api/payments/my-purchases
router.get('/my-purchases', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('recipeId')
      .sort({ paidAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch purchased recipes', error: error.message });
  }
});

module.exports = router;
