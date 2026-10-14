/**
 * UTILIDAD DE DIVISAS: src/utils/currency.ts
 * 
 * Aquí definimos las monedas disponibles (USD, MXN, EUR),
 * sus tasas de cambio y la función para formatear los precios.
 * 
 * Puedes ajustar las tasas de conversión (exchangeRates) cuando desees.
 */

export type Currency = 'USD' | 'MXN' | 'EUR';

// Tasas de cambio aproximadas teniendo como base el dólar (1 USD)
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,     // Dólar estadounidense (moneda base)
  MXN: 19.5,    // Peso mexicano (1 USD = 19.50 MXN)
  EUR: 0.92,    // Euro (1 USD = 0.92 EUR)
};

// Símbolos y etiquetas para mostrar en el selector
export const CURRENCY_INFO: Record<Currency, { label: string; symbol: string; locale: string }> = {
  USD: { label: 'USD ($)', symbol: '$', locale: 'en-US' },
  MXN: { label: 'MXN ($)', symbol: '$', locale: 'es-MX' },
  EUR: { label: 'EUR (€)', symbol: '€', locale: 'de-DE' },
};

/**
 * Función que convierte el precio base en USD a la moneda elegida
 * y lo formatea con su símbolo y decimales correctos.
 */
export function formatCurrency(amountInUSD: number, currency: Currency = 'USD'): string {
  const rate = EXCHANGE_RATES[currency] || 1;
  const convertedAmount = amountInUSD * rate;

  return new Intl.NumberFormat(CURRENCY_INFO[currency].locale, {
    style: 'currency',
    currency: currency,
  }).format(convertedAmount);
}
