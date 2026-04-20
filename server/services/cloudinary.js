const { Readable } = require('stream');
const { v2: cloudinary } = require('cloudinary');

let configured = false;

function ensureCloudinaryConfig() {
  if (configured) {
    return;
  }

  const requiredKeys = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length) {
    throw new Error(
      `Missing Cloudinary configuration: ${missingKeys.join(', ')}`
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  configured = true;
}

function uploadBuffer(buffer, options = {}) {
  ensureCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder:
          process.env.CLOUDINARY_PRODUCT_FOLDER || 'bittuTelecom/products',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

async function destroyAssets(publicIds) {
  const uniquePublicIds = [...new Set([].concat(publicIds || []).filter(Boolean))];

  if (!uniquePublicIds.length) {
    return;
  }

  ensureCloudinaryConfig();

  await Promise.allSettled(
    uniquePublicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    )
  );
}

exports.uploadBuffer = uploadBuffer;
exports.destroyAssets = destroyAssets;
exports.ensureCloudinaryConfig = ensureCloudinaryConfig;
