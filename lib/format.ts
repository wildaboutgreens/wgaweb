/** Format paise to INR string like "₹129.00" */
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
