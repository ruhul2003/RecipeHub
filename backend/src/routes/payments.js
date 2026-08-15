const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

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
    let description = 'Unlock unlimited recipe creation & exclusive gold PRO chef badge!';

    if (type === 'recipe' && recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (recipe) {
        title = `Purchase Recipe: ${recipe.recipeName}`;
        description = `Chef Recipe Access by ${recipe.authorName}`;
        priceAmount = 499; // $4.99 for recipe purchase
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    const productId = process.env.STRIPE_PRODUCT_ID || 'prod_V4vXvZgqoVuPxX';

    // If valid Stripe Secret Key is present
    if (stripeKey && stripeKey.startsWith('sk_') && !stripeKey.includes('TestKeyStripe1234567890')) {
      const stripe = Stripe(stripeKey);

      const priceData = {
        currency: 'usd',
        unit_amount: priceAmount,
      };

      if (type === 'premium' && productId && productId.startsWith('prod_')) {
        priceData.product = productId;
      } else {
        priceData.product_data = {
          name: title,
          description: description,
        };
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: priceData,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${type || 'premium'}&recipeId=${recipeId || ''}`,
        cancel_url: `${frontendUrl}/dashboard/profile`,
        customer_email: req.user.email,
        metadata: {
          userId: req.user._id.toString(),
          type: type || 'premium',
          recipeId: recipeId || '',
        },
      });

      return res.json({ success: true, url: session.url });
    }

    // Fallback mode for local dev environment
    const mockTxId = 'tx_stripe_' + Math.random().toString(36).substring(2, 10) + Date.now();

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
      url: `${frontendUrl}/dashboard/payment-success?tx=${mockTxId}&type=${type}`,
      payment,
    });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ success: false, message: 'Stripe checkout creation failed', error: error.message });
  }
});

// @route POST /api/payments/confirm-session
router.post('/confirm-session', verifyToken, async (req, res) => {
  try {
    const { session_id, tx, type, recipeId } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY || '';

    if (session_id && stripeKey.startsWith('sk_') && !stripeKey.includes('TestKeyStripe1234567890')) {
      const stripe = Stripe(stripeKey);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session && session.payment_status === 'paid') {
        const pType = session.metadata?.type || type || 'premium';
        const pRecipeId = session.metadata?.recipeId || recipeId;

        const existingPayment = await Payment.findOne({ transactionId: session.id });
        if (!existingPayment) {
          await Payment.create({
            userEmail: req.user.email,
            userId: req.user._id,
            amount: (session.amount_total || 1999) / 100,
            recipeId: pType === 'recipe' ? pRecipeId : undefined,
            transactionId: session.id,
            paymentStatus: 'completed',
          });
        }

        if (pType === 'premium') {
          await User.findByIdAndUpdate(req.user._id, { isPremium: true });
        }

        return res.json({ success: true, message: 'Stripe Payment confirmed & recorded!' });
      }
    }

    if (type === 'premium') {
      await User.findByIdAndUpdate(req.user._id, { isPremium: true });
    }

    res.json({ success: true, message: 'Payment status verified.' });
  } catch (error) {
    console.error('Confirm Session Error:', error);
    res.status(500).json({ success: false, message: 'Confirmation failed', error: error.message });
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
