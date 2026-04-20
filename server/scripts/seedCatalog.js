require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const { Product } = require('../model/Product');
const { Brand } = require('../model/Brand');
const { Category } = require('../model/Category');

async function seedCatalog() {
  const catalogPath = path.resolve(__dirname, '..', 'data.json');
  const { products = [] } = require(catalogPath);

  await mongoose.connect(process.env.MONGODB_URL);

  const brandDocs = Array.from(
    new Map(
      products.map((product) => [
        product.brand,
        { label: product.brand, value: product.brand },
      ])
    ).values()
  );

  const categoryDocs = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        { label: product.category, value: product.category },
      ])
    ).values()
  );

  if (brandDocs.length) {
    await Brand.bulkWrite(
      brandDocs.map((brand) => ({
        updateOne: {
          filter: { value: brand.value },
          update: { $setOnInsert: brand },
          upsert: true,
        },
      }))
    );
  }

  if (categoryDocs.length) {
    await Category.bulkWrite(
      categoryDocs.map((category) => ({
        updateOne: {
          filter: { value: category.value },
          update: { $setOnInsert: category },
          upsert: true,
        },
      }))
    );
  }

  if (products.length) {
    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { title: product.title },
          update: {
            $setOnInsert: {
              ...product,
              discountPrice: Math.round(
                product.price * (1 - product.discountPercentage / 100)
              ),
            },
          },
          upsert: true,
        },
      }))
    );
  }

  console.log(`Seeded ${products.length} catalog products`);
  await mongoose.disconnect();
}

seedCatalog().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
