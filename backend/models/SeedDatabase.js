require('dotenv').config({ path: './.env' });
const connectDB = require('../models/db.js');
const Destination = require('../models/Destination.js');

const seedData = {
  national: [
          {
            id: "1",
            name: "Rajasthan",
            country: "India",
            description: "Land of Kings featuring majestic palaces, vibrant culture, and vast desert landscapes.",
            image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop",
            rating: 4.8,
            priceRange: [200, 800],
            categories: ["culture", "heritage", "desert"],
            type: "national"
          },
          {
            id: "2",
            name: "Kerala",
            country: "India",
            description: "God's Own Country with serene backwaters, lush greenery, and pristine beaches.",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
            rating: 4.9,
            priceRange: [150, 600],
            categories: ["nature", "ayurveda", "backwaters"],
            type: "national"
          },
          {
            id: "3",
            name: "Goa",
            country: "India",
            description: "Beach paradise with Portuguese heritage, vibrant nightlife, and water sports.",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
            rating: 4.7,
            priceRange: [100, 500],
            categories: ["beaches", "nightlife", "seafood"],
            type: "national"
          },
          {
            id: "4",
            name: "Uttarakhand",
            country: "India",
            description: "Devbhoomi featuring Himalayan peaks, spiritual destinations, and adventure sports.",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop",
            rating: 4.8,
            priceRange: [120, 600],
            categories: ["mountains", "spiritual", "adventure"],
            type: "national"
          },
          {
            id: "5",
            name: "Tamil Nadu",
            country: "India",
            description: "Land of Temples with rich cultural heritage, classical arts, and coastal beauty.",
            image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop",
            rating: 4.6,
            priceRange: [100, 450],
            categories: ["temples", "culture", "cuisine"],
            type: "national"
          },
          {
            id: "6",
            name: "Maharashtra",
            country: "India",
            description: "Home to vibrant Mumbai, historic caves, and beautiful Western Ghats.",
            image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1000&auto=format&fit=crop",
            rating: 4.7,
            priceRange: [150, 700],
            categories: ["metropolitan", "history", "nature"],
            type: "national"
          }
        ],
        international: [
          {
            id: "1",
            name: "France",
            country: "Europe",
            description: "Experience romance, art, and gastronomy in the heart of Europe.",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
            rating: 4.7,
            priceRange: [1000, 3000],
            categories: ["culture", "cuisine", "art"],
            type: "international"
          },
          {
            id: "2",
            name: "Japan",
            country: "Asia",
            description: "Blend of ancient traditions and modern technology with unique culture.",
            image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop",
            rating: 4.9,
            priceRange: [1200, 3500],
            categories: ["technology", "tradition", "cuisine"],
            type: "international"
          },
          {
            id: "3",
            name: "Australia",
            country: "Oceania",
            description: "Land of diverse landscapes, unique wildlife, and beautiful beaches.",
            image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000&auto=format&fit=crop",
            rating: 4.8,
            priceRange: [1500, 4000],
            categories: ["wildlife", "beaches", "adventure"],
            type: "international"
          },
          {
            id: "4",
            name: "Italy",
            country: "Europe",
            description: "Home to ancient history, art masterpieces, and world-famous cuisine.",
            image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1000&auto=format&fit=crop",
            rating: 4.8,
            priceRange: [900, 2800],
            categories: ["history", "art", "food"],
            type: "international"
          },
          {
            id: "5",
            name: "Thailand",
            country: "Asia",
            description: "Tropical paradise with stunning beaches, temples, and vibrant street life.",
            image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
            rating: 4.6,
            priceRange: [600, 2000],
            categories: ["beaches", "culture", "nightlife"],
            type: "international"
          },
          {
            id: "6",
            name: "Switzerland",
            country: "Europe",
            description: "Alpine wonderland with pristine lakes, mountains, and chocolate.",
            image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
            rating: 4.9,
            priceRange: [1500, 4500],
            categories: ["mountains", "scenic", "luxury"],
            type: "international"
          }
        ]
};

const seedDatabase = async () => {
  try {
    // Debug: Check if environment variable is loaded
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await connectDB();
    
    // Clear existing data
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');
    
    // Insert national destinations
    const nationalResult = await Destination.insertMany(seedData.national);
    console.log(`Inserted ${nationalResult.length} national destinations`);
    
    // Insert international destinations
    const internationalResult = await Destination.insertMany(seedData.international);
    console.log(`Inserted ${internationalResult.length} international destinations`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Execute the seeding
seedDatabase();