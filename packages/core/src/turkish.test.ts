/**
 * Tests for Turkish ICU/CLDR helpers
 * CRITICAL: These tests verify correct handling of i/ı/İ/I
 */

import { describe, it, expect } from 'vitest';
import {
  toLowerCaseTurkish,
  toUpperCaseTurkish,
  equalsTurkish,
  toAsciiTwin,
  isStrictTurkishAlphabet,
  countSyllables,
  extractLetters
} from './turkish';

describe('Turkish case mapping', () => {
  it('should handle lowercase I → ı (not i)', () => {
    expect(toLowerCaseTurkish('ISTANBUL')).toBe('ıstanbul');
    expect(toLowerCaseTurkish('İSTANBUL')).toBe('istanbul');
  });

  it('should handle uppercase i → İ (not I)', () => {
    expect(toUpperCaseTurkish('istanbul')).toBe('İSTANBUL');
    expect(toUpperCaseTurkish('ıstanbul')).toBe('ISTANBUL');
  });

  it('should handle dotted and dotless i correctly', () => {
    expect(toLowerCaseTurkish('I')).toBe('ı'); // dotless
    expect(toLowerCaseTurkish('İ')).toBe('i'); // dotted
    expect(toUpperCaseTurkish('i')).toBe('İ'); // dotted
    expect(toUpperCaseTurkish('ı')).toBe('I'); // dotless
  });
});

describe('Turkish equality', () => {
  it('should compare strings case-insensitively with Turkish rules', () => {
    expect(equalsTurkish('İstanbul', 'istanbul')).toBe(true);
    expect(equalsTurkish('ISTANBUL', 'ıstanbul')).toBe(true);
    expect(equalsTurkish('Işık', 'ışık')).toBe(true);
  });
});

describe('ASCII twin generation', () => {
  it('should convert Turkish diacritics to ASCII', () => {
    expect(toAsciiTwin('Şebnem')).toBe('Sebnem');
    expect(toAsciiTwin('Çağla')).toBe('Cagla');
    expect(toAsciiTwin('Gökçe')).toBe('Gokce');
    expect(toAsciiTwin('Özgür')).toBe('Ozgur');
    expect(toAsciiTwin('Işık')).toBe('Isik');
  });
});

describe('Turkish alphabet validation', () => {
  it('should accept names with only Turkish letters', () => {
    expect(isStrictTurkishAlphabet('Ayşe')).toBe(true);
    expect(isStrictTurkishAlphabet('Mehmet')).toBe(true);
    expect(isStrictTurkishAlphabet('Gökçe')).toBe(true);
  });

  it('should reject names with W, Q, X', () => {
    expect(isStrictTurkishAlphabet('Wilma')).toBe(false);
    expect(isStrictTurkishAlphabet('Qasim')).toBe(false);
    expect(isStrictTurkishAlphabet('Xena')).toBe(false);
  });
});

describe('Syllable counting', () => {
  it('should count syllables correctly', () => {
    expect(countSyllables('Ay')).toBe(1);
    expect(countSyllables('Ali')).toBe(2);
    expect(countSyllables('Ayşe')).toBe(2);
    expect(countSyllables('Mehmet')).toBe(2);
    expect(countSyllables('Fatma')).toBe(2);
    expect(countSyllables('Zeynep')).toBe(2);
    expect(countSyllables('Ahmet')).toBe(2);
    expect(countSyllables('İsmail')).toBe(3);
  });
});

describe('Letter extraction', () => {
  it('should extract unique letters', () => {
    const letters = extractLetters('Ayşe');
    expect(letters).toContain('a');
    expect(letters).toContain('y');
    expect(letters).toContain('ş');
    expect(letters).toContain('e');
    expect(letters.length).toBe(4);
  });
});
