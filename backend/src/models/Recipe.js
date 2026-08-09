const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    recipeName: { type: String, required: true },
    recipeImage: { type: String, required: true },
    category: { type: String, required: true },
    cuisineType: { type: String, required: true },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    preparationTime: { type: Number, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
