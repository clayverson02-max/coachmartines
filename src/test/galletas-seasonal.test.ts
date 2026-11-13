import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Exercise the actual inline rule served to visitors, not a separate implementation.
const html = readFileSync('src/static/pagina.html', 'utf8');
const rule = html.split('// BEGIN seasonal date rule')[1]?.split('// END seasonal date rule')[0];
if (!rule) throw new Error('Seasonal date rule is missing');
const daysUntilChristmas = new Function(`${rule}; return daysUntilChristmas;`)() as (date: Date) => number | null;

describe('Galletas seasonal date', () => {
  it('counts calendar days to December 25 of the current year', () => {
    expect(daysUntilChristmas(new Date(2026, 10, 13, 23, 59))).toBe(42);
    expect(daysUntilChristmas(new Date(2027, 11, 24, 0, 1))).toBe(1);
    expect(daysUntilChristmas(new Date(2028, 1, 29))).toBe(300);
  });
  it('keeps the line on December 25 and hides it after that date', () => {
    expect(daysUntilChristmas(new Date(2026, 11, 25, 23, 59))).toBe(0);
    expect(daysUntilChristmas(new Date(2026, 11, 26))).toBeNull();
    expect(daysUntilChristmas(new Date(2026, 11, 31))).toBeNull();
  });
});