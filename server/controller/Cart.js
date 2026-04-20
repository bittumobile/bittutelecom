const { Cart } = require('../model/Cart');
const { Product } = require('../model/Product');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const { product, quantity } = req.body;

  try {
    // 1. Get product from DB
    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check stock
    if (productData.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // 3. Check existing cart item
    const existingItem = await Cart.findOne({ user: id, product });

    const totalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // 4. Prevent exceeding stock
    if (totalQuantity > productData.stock) {
      return res.status(400).json({
        message: `Only ${productData.stock} items available in stock`,
      });
    }

    let cartItem;

    if (existingItem) {
      // Update existing
      existingItem.quantity = totalQuantity;
      cartItem = await existingItem.save();
    } else {
      // Create new
      cartItem = new Cart({
        user: id,
        product,
        quantity,
      });
      await cartItem.save();
    }

    const result = await cartItem.populate("product");
    res.status(201).json(result);

  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findById(id).populate("product");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        message: `Only ${cartItem.product.stock} items available`,
      });
    }

    cartItem.quantity = quantity;
    const updated = await cartItem.save();

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
};
