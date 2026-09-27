/** Format paise to INR string like "₹129.00" */
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

/**
 * Optimizes a partner logo URL:
 * - Injects `e_trim` for Cloudinary images to automatically crop away excess transparent
 *   or uniform solid white border margins, so square/small-framed logos expand to fill their container.
 * - Injects `f_auto,q_auto` for optimal delivery format and compression.
 */
export function getOptimizedLogoUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    if (!trimmed.includes('e_trim')) {
      return trimmed.replace('/image/upload/', '/image/upload/e_trim,f_auto,q_auto/');
    }
  }

  return trimmed;
}
