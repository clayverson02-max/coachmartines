import { describe, expect, it } from 'vitest';
import { CHECKOUT_VALUE, GALLETAS_PIXEL_ID, permitsAdvertising } from './galletas-tracking-policy';
describe('Galletas measurement', () => {
  it('uses the requested pixel', () => expect(GALLETAS_PIXEL_ID).toBe('1351267993847099'));
  it('uses the US$5.50 offer value for checkout measurement', () => expect(CHECKOUT_VALUE).toBe(5.5));
  it('blocks consent regions and unknown locations without a banner', () => {
    expect(permitsAdvertising('ES', false)).toBe(false);
    expect(permitsAdvertising(undefined, false)).toBe(false);
    expect(permitsAdvertising('XX', false)).toBe(false);
    expect(permitsAdvertising('BR', false)).toBe(true);
  });
  it('honors refusal outside consent regions', () => expect(permitsAdvertising('BR', true)).toBe(false));
});
