const multer = require('multer');

const acceptedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 4,
  },
  fileFilter: (req, file, cb) => {
    if (!acceptedMimeTypes.has(file.mimetype)) {
      cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
      return;
    }

    cb(null, true);
  },
});

const productUploadHandler = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.productUpload = (req, res, next) => {
  productUploadHandler(req, res, (error) => {
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    next();
  });
};
