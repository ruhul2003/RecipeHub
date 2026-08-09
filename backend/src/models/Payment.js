const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    paidAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
