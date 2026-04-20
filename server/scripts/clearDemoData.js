require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('../model/Product');
const { Brand } = require('../model/Brand');
const { Category } = require('../model/Category');
const { Cart } = require('../model/Cart');
const { Order } = require('../model/Order');
const { User } = require('../model/User');

async function clearDemoData() {
  await mongoose.connect(process.env.MONGODB_URL);

  const [productsResult, brandsResult, categoriesResult, cartsResult, ordersResult, usersResult] =
    await Promise.all([
      Product.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({
        role: { $ne: 'admin' },
        email: { $in: ['test@gmail.com', 'demo@gmail.com'] },
      }),
    ]);

  console.log(
    JSON.stringify(
      {
        clearedProducts: productsResult.deletedCount,
        clearedBrands: brandsResult.deletedCount,
        clearedCategories: categoriesResult.deletedCount,
        clearedCartItems: cartsResult.deletedCount,
        clearedOrders: ordersResult.deletedCount,
        clearedDemoUsers: usersResult.deletedCount,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

clearDemoData().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
