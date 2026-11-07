export const GALLETAS_PIXEL_ID = '1351267993847099';
export const CHECKOUT_VALUE = 7.5;
const regulated = new Set('AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE GB CH'.split(' '));
export function permitsAdvertising(country: string | undefined, optedOut: boolean) {
  return !optedOut && !!country && /^[A-Z]{2}$/.test(country) && !['XX', 'T1'].includes(country) && !regulated.has(country);
}