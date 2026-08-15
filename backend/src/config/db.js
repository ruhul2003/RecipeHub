const mongoose = require('mongoose');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Report = require('../models/Report');
const Payment = require('../models/Payment');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing in backend/.env');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ Connected directly to MongoDB Atlas host: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);

    // Ensure all Mongoose collections exist in MongoDB Atlas
    await User.createCollection();
    await Recipe.createCollection();
    await Favorite.createCollection();
    await Report.createCollection();
    await Payment.createCollection();
    console.log('✨ Verified database collections: users, recipes, favorites, reports, payments');

    const count = await Recipe.countDocuments();
    console.log(`ℹ️ MongoDB Atlas currently stores ${count} recipes.`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
