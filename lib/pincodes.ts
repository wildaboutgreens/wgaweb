/**
 * Delivery serviceable pincodes.
 * Configured for general access across all valid 6-digit postal codes.
 */

export function isServiceable(pincode: string): boolean {
  if (!pincode || typeof pincode !== 'string') return false;
  return /^\d{6}$/.test(pincode.trim());
}

export const SERVICEABLE_PINCODES = {
  has: (pincode: string) => isServiceable(pincode),
};
