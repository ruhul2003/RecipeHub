const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Favorite = require('./models/Favorite');
const Report = require('./models/Report');
const Payment = require('./models/Payment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipehub');
    console.log('Connected to MongoDB for Seeding...');

    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Favorite.deleteMany({});
    await Report.deleteMany({});
    await Payment.deleteMany({});

    const defaultPassword = await bcrypt.hash('Password123', 10);

    const admin = await User.create({
      name: 'Chef Admin',
      email: 'admin@recipehub.com',
      password: defaultPassword,
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      isPremium: true,
    });

    const user1 = await User.create({
      name: 'Sophia Laurent',
      email: 'sophia@example.com',
      password: defaultPassword,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      isPremium: true,
    });

    const user2 = await User.create({
      name: 'Marco Rossi',
      email: 'marco@example.com',
      password: defaultPassword,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      isPremium: false,
    });

    const sampleRecipes = [
      {
        recipeName: 'Truffle Cream Tagliatelle',
        recipeImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
        category: 'Italian',
        cuisineType: 'Pasta',
        difficultyLevel: 'Medium',
        preparationTime: 25,
        ingredients: ['Tagliatelle pasta', 'Heavy cream', 'Truffle oil', 'Parmigiano-Reggiano', 'Garlic', 'Fresh parsley'],
        instructions: '1. Cook pasta until al dente.\n2. Sauté garlic in butter.\n3. Pour cream and grated cheese.\n4. Toss pasta with truffle oil and garnish with parsley.',
        authorId: user1._id,
        authorName: user1.name,
        authorEmail: user1.email,
        likesCount: 142,
        isFeatured: true,
      },
      {
        recipeName: 'Artisanal Neapolitan Margherita Pizza',
        recipeImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
        category: 'Italian',
        cuisineType: 'Pizza',
        difficultyLevel: 'Hard',
        preparationTime: 45,
        ingredients: ['00 Flour', 'San Marzano tomatoes', 'Fresh Mozzarella', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt'],
        instructions: '1. Knead dough and let ferment for 24 hours.\n2. Stretch dough by hand into a circle.\n3. Top with crushed tomatoes, mozzarella, and olive oil.\n4. Bake at high heat (450°C) for 90 seconds.',
        authorId: admin._id,
        authorName: admin.name,
        authorEmail: admin.email,
        likesCount: 289,
        isFeatured: true,
      },
      {
        recipeName: 'Avocado Toast with Poached Eggs',
        recipeImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        category: 'Breakfast',
        cuisineType: 'American',
        difficultyLevel: 'Easy',
        preparationTime: 15,
        ingredients: ['Sourdough bread', 'Hass avocado', 'Organic Eggs', 'Chili flakes', 'Lemon juice', 'Microgreens'],
        instructions: '1. Toast sourdough bread slice until golden brown.\n2. Mash avocado with lemon, salt, and pepper.\n3. Poach eggs in simmering water with vinegar for 3 minutes.\n4. Assemble toast, egg, and chili flakes.',
        authorId: user2._id,
        authorName: user2.name,
        authorEmail: user2.email,
        likesCount: 98,
        isFeatured: true,
      },
      {
        recipeName: 'Matcha Green Tea Glazed Donuts',
        recipeImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        category: 'Dessert',
        cuisineType: 'Bakery',
        difficultyLevel: 'Medium',
        preparationTime: 35,
        ingredients: ['Yeast dough', 'Culinary Matcha powder', 'Powdered sugar', 'Whole milk', 'Vanilla extract'],
        instructions: '1. Fry dough rings until golden.\n2. Whisk matcha powder with powdered sugar and milk.\n3. Dip hot donuts into green tea glaze.',
        authorId: user1._id,
        authorName: user1.name,
        authorEmail: user1.email,
        likesCount: 165,
        isFeatured: false,
      },
      {
        recipeName: 'Spicy Thai Red Curry Seafood',
        recipeImage: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
        category: 'Asian',
        cuisineType: 'Thai',
        difficultyLevel: 'Medium',
        preparationTime: 30,
        ingredients: ['Tiger prawns', 'Red curry paste', 'Coconut milk', 'Kaffir lime leaves', 'Bamboo shoots', 'Thai basil'],
        instructions: '1. Simmer red curry paste with top cream of coconut milk.\n2. Add prawns, lime leaves, and vegetables.\n3. Cook until prawns are pink and serve with Jasmine rice.',
        authorId: admin._id,
        authorName: admin.name,
        authorEmail: admin.email,
        likesCount: 210,
        isFeatured: true,
      },
      {
        recipeName: 'Classic French Butter Croissant',
        recipeImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        category: 'Bakery',
        cuisineType: 'French',
        difficultyLevel: 'Hard',
        preparationTime: 120,
        ingredients: ['Pastry flour', 'European butter', 'Yeast', 'Sugar', 'Milk', 'Egg wash'],
        instructions: '1. Prepare laminated dough with butter block.\n2. Perform three single folds with rests in fridge.\n3. Shape into crescents and bake at 200°C until deep golden.',
        authorId: user1._id,
        authorName: user1.name,
        authorEmail: user1.email,
        likesCount: 312,
        isFeatured: true,
      }
    ];

    const recipes = await Recipe.insertMany(sampleRecipes);

    await Favorite.create({
      userEmail: user1.email,
      userId: user1._id,
      recipeId: recipes[1]._id,
    });

    await Report.create({
      recipeId: recipes[3]._id,
      recipeName: recipes[3].recipeName,
      reporterEmail: user2.email,
      reason: 'Offensive Content',
    });

    await Payment.create({
      userEmail: user1.email,
      userId: user1._id,
      amount: 19.99,
      transactionId: 'tx_seed_stripe_998124',
      paymentStatus: 'completed',
    });

    console.log('Database Seeded Successfully!');
    console.log('Admin Account: admin@recipehub.com / Password123');
    console.log('User Account: sophia@example.com / Password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
