// The price and URL must match the active checkout offer before publishing.
export const CHECKOUT_VALUE = 6.9;
export const CHECKOUT_URL = "https://pay.cakto.com.br/37cz3f8_1330906";
export const CHECKOUT_PRICE_ES = CHECKOUT_VALUE.toFixed(2).replace(".", ",");
export const BASIC_CHECKOUT_VALUE = 4.5;
export const BASIC_CHECKOUT_URL = "https://pay.hotmart.com/Y108473879O?checkoutMode=10";
export const BASIC_PRICE_ES = BASIC_CHECKOUT_VALUE.toFixed(2).replace(".", ",");
export const GALLETAS_PLANS = {
  basic: { name: 'Solo la masa', value: BASIC_CHECKOUT_VALUE, url: BASIC_CHECKOUT_URL },
  complete: { name: 'Método completo', value: CHECKOUT_VALUE, url: CHECKOUT_URL },
} as const;
export type GalletasPlan = keyof typeof GALLETAS_PLANS;
