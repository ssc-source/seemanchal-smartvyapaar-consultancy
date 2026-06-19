const cloudinary = require('cloudinary').v2;
const fs = require('fs');

function configured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configure() {
  if (!configured()) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

configure();

exports.configured = configured;

exports.uploadImage = async (filePath, options = {}) => {
  if (!configured()) throw new Error('Cloudinary not configured');
  const opts = { folder: options.folder || undefined, resource_type: 'image', transformation: options.transformation };
  const res = await cloudinary.uploader.upload(filePath, opts);
  return {
    public_id: res.public_id,
    url: res.secure_url,
    width: res.width,
    height: res.height,
    bytes: res.bytes,
    format: res.format,
  };
};

exports.deleteImage = async (publicId) => {
  if (!configured()) throw new Error('Cloudinary not configured');
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

exports.replaceImage = async (publicId, filePath, options = {}) => {
  if (!configured()) throw new Error('Cloudinary not configured');
  // Upload new and remove old
  const uploaded = await exports.uploadImage(filePath, options);
  if (publicId) {
    try { await exports.deleteImage(publicId); } catch (e) { /* ignore */ }
  }
  return uploaded;
};

exports.generateOptimizedUrl = (publicId, opts = {}) => {
  if (!configured()) {
    throw new Error('Cloudinary not configured');
  }
  const transformation = [];
  if (opts.width) transformation.push({ width: opts.width, crop: 'scale' });
  if (opts.format) transformation.push({ fetch_format: opts.format });
  return cloudinary.url(publicId, { secure: true, ...opts, transformation });
};
