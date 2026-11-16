import { describe, expect, it } from 'vitest';
import { CHECKOUT_VALUE, GALLETAS_PIXEL_ID, permitsAdvertising, checkoutEventData } from './galletas-tracking-policy';
import { GALLETAS_PLANS } from '../config/galletas';
describe('Galletas measurement', () => {
  it('uses the requested pixel', () => expect(GALLETAS_PIXEL_ID).toBe('1351267993847099'));
  it('uses the US$6.90 complete offer value and Cakto checkout', () => {
    expect(CHECKOUT_VALUE).toBe(6.9);
    expect(GALLETAS_PLANS.complete.url).toBe('https://pay.cakto.com.br/37cz3f8_1330906');
    expect(checkoutEventData('complete')).toEqual({ value: 6.9, currency: 'USD', content_ids: ['complete'], content_name: 'Método completo', content_type: 'product' });
  });
  it('uses the US$4.50 basic offer and its checkout', () => {
    expect(GALLETAS_PLANS.basic.url).toBe('https://pay.hotmart.com/Y108473879O?checkoutMode=10');
    expect(checkoutEventData('basic')).toEqual({ value: 4.5, currency: 'USD', content_ids: ['basic'], content_name: 'Solo la masa', content_type: 'product' });
  });
  it('blocks consent regions and unknown locations without a banner', () => {
    expect(permitsAdvertising('ES', false)).toBe(false);
    expect(permitsAdvertising(undefined, false)).toBe(false);
    expect(permitsAdvertising('XX', false)).toBe(false);
    expect(permitsAdvertising('BR', false)).toBe(true);
  });
  it('honors refusal outside consent regions', () => expect(permitsAdvertising('BR', true)).toBe(false));
});
