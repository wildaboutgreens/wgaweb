import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Extracts Cloudinary public_id from a full Cloudinary URL.
 * Handles URLs with or without version strings and file extensions.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v1234567890/products/greens/thumbnail/thumbnail.jpg"
 *   -> "products/greens/thumbnail/thumbnail"
 */
export function extractPublicIdFromUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  let uploadIndex = url.indexOf('/image/upload/');
  let uploadPrefixLength = '/image/upload/'.length;
  if (uploadIndex === -1) {
    uploadIndex = url.indexOf('/video/upload/');
    uploadPrefixLength = '/video/upload/'.length;
  }
  if (uploadIndex === -1) return null;

  let pathAfterUpload = url.slice(uploadIndex + uploadPrefixLength);
  pathAfterUpload = pathAfterUpload.split('?')[0];

  const parts = pathAfterUpload.split('/');
  const filteredParts: string[] = [];
  let foundVersionOrPath = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!foundVersionOrPath) {
      if (/^v\d+$/.test(part)) {
        foundVersionOrPath = true;
        continue;
      }
      if (part.includes(',') || /^(c_|w_|h_|q_|f_|e_|b_|r_|a_|g_)/.test(part)) {
        continue;
      }
      foundVersionOrPath = true;
    }
    filteredParts.push(part);
  }

  if (filteredParts.length === 0) return null;
  const fullPath = filteredParts.join('/');
  const lastDotIndex = fullPath.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return fullPath.slice(0, lastDotIndex);
  }
  return fullPath;
}

