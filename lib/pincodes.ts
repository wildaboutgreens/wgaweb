/**
 * Serviceable pincodes for the Chandigarh-Mohali-Panchkula tricity area.
 * This is a hardcoded MVP list — replace with a DB/API lookup later.
 */

// Chandigarh: 160001–160036, plus a few additional sectors
const chandigarh: string[] = [];
for (let i = 1; i <= 36; i++) {
  chandigarh.push(`1600${i.toString().padStart(2, '0')}`);
}
chandigarh.push('160043', '160047', '160101', '160102', '160103');

// Mohali / SAS Nagar
const mohali = [
  '140301', '140306', '140307', '140308', '140603',
  '160055', '160059', '160062', '160071',
];

// Panchkula
const panchkula = [
  '134109', '134112', '134113', '134114', '134116', '134117',
];

const SERVICEABLE_PINCODES = new Set([
  ...chandigarh,
  ...mohali,
  ...panchkula,
]);

export function isServiceable(pincode: string): boolean {
  return SERVICEABLE_PINCODES.has(pincode.trim());
}

export { SERVICEABLE_PINCODES };
