const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Admin = require('./models/Admin');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Rating = require('./models/Rating');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Admin.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Rating.deleteMany();
    console.log('Cleared existing data');

    // Create Admins (passwords hashed via model pre-save hook)
    const admin1 = await Admin.create({ name: 'Alice Tech', email: 'alice@techworld.com', password: 'password123', storeName: 'TechWorld Store' });
    const admin2 = await Admin.create({ name: 'Bob Fashion', email: 'bob@fashionhub.com', password: 'password123', storeName: 'FashionHub Store' });
    const admin3 = await Admin.create({ name: 'Carol Home', email: 'carol@homedelight.com', password: 'password123', storeName: 'HomeDelight Store' });
    console.log('Admins created');

    // Create Users
    const user1 = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123', phone: '1234567890' });
    const user2 = await User.create({ name: 'Jane Smith', email: 'jane@example.com', password: 'password123', phone: '9876543210' });
    console.log('Users created');

    // --- TechWorld Store (Admin 1) ---
    const techCat1 = await Category.create({ adminId: admin1._id, name: 'Laptops', description: 'Portable computers' });
    const techCat2 = await Category.create({ adminId: admin1._id, name: 'Accessories', description: 'Tech accessories' });

    const laptop1 = await Product.create({ adminId: admin1._id, categoryId: techCat1._id, name: 'ProBook 15', description: 'High-performance 15" laptop with Intel i7', price: 1299.99, stock: 20, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' });
    const laptop2 = await Product.create({ adminId: admin1._id, categoryId: techCat1._id, name: 'SlimBook Air', description: 'Ultra-thin 13" laptop for everyday use', price: 899.99, stock: 15, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' });
    const acc1 = await Product.create({ adminId: admin1._id, categoryId: techCat2._id, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with long battery life', price: 39.99, stock: 50, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' });
    const acc2 = await Product.create({ adminId: admin1._id, categoryId: techCat2._id, name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: 89.99, stock: 30, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' });

    // --- FashionHub Store (Admin 2) ---
    const fashionCat1 = await Category.create({ adminId: admin2._id, name: 'Men\'s Clothing', description: 'Clothing for men' });
    const fashionCat2 = await Category.create({ adminId: admin2._id, name: 'Footwear', description: 'Shoes and sandals' });

    const shirt1 = await Product.create({ adminId: admin2._id, categoryId: fashionCat1._id, name: 'Classic White Shirt', description: 'Premium cotton formal shirt', price: 49.99, stock: 40, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400' });
    const shirt2 = await Product.create({ adminId: admin2._id, categoryId: fashionCat1._id, name: 'Denim Jacket', description: 'Stylish casual denim jacket', price: 79.99, stock: 25, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' });
    const shoe1 = await Product.create({ adminId: admin2._id, categoryId: fashionCat2._id, name: 'Running Sneakers', description: 'Lightweight sport running shoes', price: 119.99, stock: 35, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' });
    const watch1 = await Product.create({ adminId: admin2._id, categoryId: fashionCat2._id, name: 'Leather Watch', description: 'Elegant leather strap analog watch', price: 159.99, stock: 20, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' });

    // --- HomeDelight Store (Admin 3) ---
    const homeCat1 = await Category.create({ adminId: admin3._id, name: 'Kitchen', description: 'Kitchen essentials' });
    const homeCat2 = await Category.create({ adminId: admin3._id, name: 'Decor', description: 'Home decoration items' });

    const item1 = await Product.create({ adminId: admin3._id, categoryId: homeCat1._id, name: 'Coffee Maker', description: 'Automatic drip coffee maker with timer', price: 69.99, stock: 30, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' });
    const item2 = await Product.create({ adminId: admin3._id, categoryId: homeCat1._id, name: 'Non-Stick Pan Set', description: 'Set of 3 premium non-stick frying pans', price: 54.99, stock: 20, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' });
    const decor1 = await Product.create({ adminId: admin3._id, categoryId: homeCat2._id, name: 'Scented Candle Set', description: 'Set of 6 aromatic soy wax candles', price: 29.99, stock: 60, image: 'https://images.unsplash.com/photo-1602607144563-e939aa45b179?w=400' });

    // Create some ratings
    await Rating.create({ userId: user1._id, adminId: admin1._id, productId: laptop1._id, rating: 5, comment: 'Amazing laptop, super fast!' });
    await Rating.create({ userId: user2._id, adminId: admin1._id, productId: laptop1._id, rating: 4, comment: 'Great performance, a bit pricey.' });
    await Rating.create({ userId: user1._id, adminId: admin2._id, productId: shirt1._id, rating: 4, comment: 'Good quality fabric.' });
    console.log('Ratings created');

    console.log('\n✅ Seed completed successfully!\n');
    console.log('=== Test Credentials ===');
    console.log('Admin 1: alice@techworld.com / password123 → TechWorld Store');
    console.log('Admin 2: bob@fashionhub.com / password123 → FashionHub Store');
    console.log('Admin 3: carol@homedelight.com / password123 → HomeDelight Store');
    console.log('User 1:  john@example.com / password123');
    console.log('User 2:  jane@example.com / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
