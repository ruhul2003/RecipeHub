const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    recipeName: { type: String },
    reporterEmail: { type: String, required: true },
    reason: { type: String, enum: ['Spam', 'Offensive Content', 'Copyright Issue'], required: true },
    status: { type: String, enum: ['pending', 'dismissed', 'resolved'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
