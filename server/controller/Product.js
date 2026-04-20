const path = require('path');
const { Product } = require('../model/Product');
const { Brand } = require('../model/Brand');
const { Category } = require('../model/Category');
const { destroyAssets, uploadBuffer } = require('../services/cloudinary');

const normalizeText = (value) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value === 'true';
  }

  return Boolean(value);
};

const normalizeStringArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(normalizeText).filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      return normalizeStringArray(parsedValue);
    } catch (error) {
      return value
        .split(',')
        .map(normalizeText)
        .filter(Boolean);
    }
  }

  return [];
};

const normalizeJsonArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      return Array.isArray(parsedValue) ? parsedValue.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  return [];
};

const parseProductData = (req) => {
  if (!req.body.productData) {
    return { ...req.body };
  }

  try {
    return JSON.parse(req.body.productData);
  } catch (error) {
    throw new Error('Invalid product payload.');
  }
};

const buildCloudinaryPublicId = (file, variant) => {
  const baseName = path
    .parse(file.originalname || `${variant}-image`)
    .name.replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase();

  return `${variant}-${Date.now()}-${baseName}`;
};

const uploadProductFiles = async (files, variant) => {
  return Promise.all(
    files.map((file) =>
      uploadBuffer(file.buffer, {
        public_id: buildCloudinaryPublicId(file, variant),
      })
    )
  );
};

const calculateDiscountPrice = (price, discountPercentage) =>
  Math.round(price * (1 - discountPercentage / 100));

const syncOption = async (Model, rawValue) => {
  const value = normalizeText(rawValue);

  if (!value) {
    return;
  }

  const existingOption = await Model.findOne({ value }).exec();

  if (existingOption) {
    if (existingOption.label !== value) {
      existingOption.label = value;
      await existingOption.save();
    }

    return;
  }

  await Model.create({ label: value, value });
};

const syncProductTaxonomy = async (product) => {
  await Promise.all([
    syncOption(Brand, product.brand),
    syncOption(Category, product.category),
  ]);
};

const normalizeProductPayload = (rawPayload) => {
  const payload = { ...rawPayload };

  if ('title' in payload) {
    payload.title = normalizeText(payload.title);
  }

  if ('description' in payload) {
    payload.description = normalizeText(payload.description);
  }

  if ('brand' in payload) {
    payload.brand = normalizeText(payload.brand);
  }

  if ('category' in payload) {
    payload.category = normalizeText(payload.category);
  }

  if ('price' in payload) {
    payload.price = normalizeNumber(payload.price, 0);
  }

  if ('discountPercentage' in payload) {
    payload.discountPercentage = normalizeNumber(payload.discountPercentage, 0);
  }

  if ('stock' in payload) {
    payload.stock = normalizeNumber(payload.stock, 0);
  }

  if ('rating' in payload) {
    payload.rating = normalizeNumber(payload.rating, 0);
  }

  if ('deleted' in payload) {
    payload.deleted = normalizeBoolean(payload.deleted);
  }

  payload.highlights = normalizeStringArray(payload.highlights);
  payload.colors = normalizeJsonArray(payload.colors);
  payload.sizes = normalizeJsonArray(payload.sizes);
  payload.existingImages = normalizeStringArray(payload.existingImages);
  payload.existingImagePublicIds = normalizeStringArray(
    payload.existingImagePublicIds
  );
  payload.existingThumbnail = normalizeText(payload.existingThumbnail);
  payload.existingThumbnailPublicId = normalizeText(
    payload.existingThumbnailPublicId
  );

  return payload;
};

exports.createProduct = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const rawPayload = parseProductData(req);
    const payload = normalizeProductPayload(rawPayload);
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFiles = req.files?.images || [];

    if (!thumbnailFile) {
      return res.status(400).json({ message: 'Thumbnail image is required.' });
    }

    if (!galleryFiles.length) {
      return res
        .status(400)
        .json({ message: 'At least one gallery image is required.' });
    }

    const [thumbnailUpload] = await uploadProductFiles([thumbnailFile], 'thumb');
    const galleryUploads = await uploadProductFiles(galleryFiles, 'gallery');

    uploadedPublicIds.push(
      thumbnailUpload.public_id,
      ...galleryUploads.map((upload) => upload.public_id)
    );

    const product = new Product({
      ...payload,
      thumbnail: thumbnailUpload.secure_url,
      thumbnailPublicId: thumbnailUpload.public_id,
      images: galleryUploads.map((upload) => upload.secure_url),
      imagePublicIds: galleryUploads.map((upload) => upload.public_id),
    });

    product.discountPrice = calculateDiscountPrice(
      product.price,
      product.discountPercentage
    );

    const doc = await product.save();
    await syncProductTaxonomy(doc);
    res.status(201).json(doc);
  } catch (err) {
    await destroyAssets(uploadedPublicIds);
    res.status(400).json({ message: err.message || 'Unable to create product.' });
  }
};

exports.fetchAllProducts = async (req, res) => {
  let condition = {};
  const canViewAdminCatalog =
    req.user && req.user.role === 'admin' && req.query.admin === 'true';

  if (!canViewAdminCatalog) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(',') },
    });
  }

  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(',') },
    });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = Number(req.query._limit);
    const page = Number(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Unable to fetch products.' });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const canViewDeletedProduct = req.user && req.user.role === 'admin';
    const product = await Product.findOne(
      canViewDeletedProduct
        ? { _id: id }
        : { _id: id, deleted: { $ne: true } }
    );

    if (!product) {
      return res.sendStatus(404);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Unable to fetch product.' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const uploadedPublicIds = [];

  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.sendStatus(404);
    }

    const rawPayload = parseProductData(req);
    const payload = normalizeProductPayload(rawPayload);
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFiles = req.files?.images || [];
    const oldPublicIdsToDelete = [];

    let thumbnailUrl = payload.existingThumbnail || existingProduct.thumbnail;
    let thumbnailPublicId =
      payload.existingThumbnailPublicId || existingProduct.thumbnailPublicId;
    let galleryUrls = payload.existingImages.length
      ? payload.existingImages
      : existingProduct.images;
    let galleryPublicIds = payload.existingImagePublicIds.length
      ? payload.existingImagePublicIds
      : existingProduct.imagePublicIds;

    if (thumbnailFile) {
      const [thumbnailUpload] = await uploadProductFiles([thumbnailFile], 'thumb');
      uploadedPublicIds.push(thumbnailUpload.public_id);
      thumbnailUrl = thumbnailUpload.secure_url;
      thumbnailPublicId = thumbnailUpload.public_id;

      if (existingProduct.thumbnailPublicId) {
        oldPublicIdsToDelete.push(existingProduct.thumbnailPublicId);
      }
    }

    if (galleryFiles.length) {
      const galleryUploads = await uploadProductFiles(galleryFiles, 'gallery');
      uploadedPublicIds.push(...galleryUploads.map((upload) => upload.public_id));
      galleryUrls = galleryUploads.map((upload) => upload.secure_url);
      galleryPublicIds = galleryUploads.map((upload) => upload.public_id);
      oldPublicIdsToDelete.push(...(existingProduct.imagePublicIds || []));
    }

    const updatedPayload = {
      ...payload,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      images: galleryUrls,
      imagePublicIds: galleryPublicIds,
    };

    delete updatedPayload.existingThumbnail;
    delete updatedPayload.existingThumbnailPublicId;
    delete updatedPayload.existingImages;
    delete updatedPayload.existingImagePublicIds;

    const product = await Product.findByIdAndUpdate(id, updatedPayload, {
      new: true,
      runValidators: true,
    });

    product.discountPrice = calculateDiscountPrice(
      product.price,
      product.discountPercentage
    );

    const updatedProduct = await product.save();
    await syncProductTaxonomy(updatedProduct);
    await destroyAssets(oldPublicIdsToDelete);
    res.status(200).json(updatedProduct);
  } catch (err) {
    await destroyAssets(uploadedPublicIds);
    res.status(400).json({ message: err.message || 'Unable to update product.' });
  }
};
