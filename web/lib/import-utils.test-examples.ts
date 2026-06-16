/**
 * v5.1 Import Utils - Proof of Correctness Test Cases
 * 
 * This file provides concrete examples demonstrating that the 4 core functions
 * work correctly for security audit verification.
 */

import { normalizePhoneNumber, escapeCsvFormula, buildCanonicalAddress, validateRow } from './import-utils';
import type { ImportRow } from './import-types';

/**
 * Test cases proving phone normalization works correctly
 */
export const PHONE_NORMALIZATION_TESTS = {
  // Valid German formats that should normalize to E.164
  valid: {
    '+491701234567': '+491701234567',      // Already E.164
    '00491701234567': '+491701234567',     // International prefix
    '01701234567': '+491701234567',        // National format
    '0170 123 4567': '+491701234567',      // With spaces
    '0170-123-4567': '+491701234567',      // With dashes
    '(0170) 123 4567': '+491701234567',    // With parentheses
    '0170.123.4567': '+491701234567',      // With dots
    '+49 170 123 4567': '+491701234567',   // E.164 with spaces
  },
  
  // Invalid formats that should return null
  invalid: {
    '': null,                              // Empty string
    'invalid': null,                       // Non-numeric
    '123': null,                           // Too short
    '+1234567890123456': null,             // Too long
    '+48170123456': null,                  // Wrong country code
    '170123456': null,                     // Missing leading zero
    '+49abc123456': null,                  // Contains letters
  }
};

/**
 * Test cases proving CSV injection protection works correctly
 */
export const CSV_INJECTION_TESTS = {
  // Dangerous formulas that should be escaped
  dangerous: {
    '=cmd|calc': "'=cmd|calc",             // Excel formula
    '+HYPERLINK("http://evil.com")': "'+HYPERLINK(\"http://evil.com\")", // Hyperlink
    '-2+3*4': "'-2+3*4",                   // Math formula
    '@SUM(A1:A10)': "'@SUM(A1:A10)",       // Function call
    '=1+1': "'=1+1",                       // Simple formula
    '+1': "'+1",                           // Plus sign
    '-test': "'-test",                     // Minus sign
    '@test': "'@test",                     // At sign
  },
  
  // Safe values that should remain unchanged
  safe: {
    'Max Mustermann': 'Max Mustermann',    // Normal name
    'Hauptstraße 123': 'Hauptstraße 123', // Normal address
    '2. OG links': '2. OG links',          // Normal unit
    'test@example.com': 'test@example.com', // Normal email
    '': '',                                // Empty string
    '   ': '',                             // Whitespace only (trimmed)
  }
};

/**
 * Test cases proving canonical address generation works correctly
 */
export const CANONICAL_ADDRESS_TESTS = {
  // Various address formats should normalize consistently
  cases: [
    { input: ['Hauptstraße 123', 'Whg 4A'], expected: 'hauptstraße 123|whg 4a' },
    { input: ['HAUPTSTRASSE 123', 'WHG 4A'], expected: 'hauptstrasse 123|whg 4a' }, // Case normalization
    { input: ['Hauptstraße  123  ', '  Whg 4A  '], expected: 'hauptstraße 123|whg 4a' }, // Whitespace normalization
    { input: ['Haupt  straße   123', 'Whg    4A'], expected: 'haupt straße 123|whg 4a' }, // Multiple spaces collapsed
    { input: ['', ''], expected: '|' }, // Empty inputs
    { input: ['Test', ''], expected: 'test|' }, // Partial empty
    { input: ['', 'Unit'], expected: '|unit' }, // Partial empty
  ]
};

/**
 * Test cases proving row validation works correctly
 */
export const ROW_VALIDATION_TESTS = {
  // Valid rows that should pass validation
  valid: [
    {
      input: {
        name: 'Max Mustermann',
        address: 'Hauptstraße 123, 80331 München',
        unit: '2. OG links',
        tenant_id: 'test-verwaltung',
        phone: '0170 123 4567',
        email: 'max@example.com',
        notes: 'VIP Mieter'
      },
      expected_errors: [],
      expected_phone: '+491701234567'
    },
    {
      input: {
        name: 'Anna Schmidt',
        address: 'Musterstraße 45, 12345 Berlin',
        unit: 'Whg 12',
        tenant_id: 'test-verwaltung'
        // No phone, email, notes (optional)
      },
      expected_errors: [],
      expected_phone: null
    },
    {
      input: {
        tenant_id: 'valid-tenant-id',
        name: 'Only ID User',
        address: 'Only ID Address 12345',
        unit: 'Only ID Unit',
      },
      expected_errors: [],
      expected_phone: null
    },
    {
      input: {
        tenant_id: 'id-only-valid-case',
        // name, address, unit are missing, but tenant_id is present, so it should be valid
      },
      expected_errors: [],
      expected_phone: null
    }
  ],
  
  // Invalid rows that should fail validation
  invalid: [
    {
      input: {
        // Missing name, address, unit, and tenant_id
      },
      expected_errors: ['Row must have either Tenant ID, or Name, Address, and Unit']
    },
    {
      input: {
        name: 'Test User',
        address: 'Test Street',
        unit: 'Unit 1',
        tenant_id: 'test',
        phone: 'invalid-phone',
        email: 'invalid-email'
      },
      expected_errors: ['Invalid phone number format', 'Invalid email format']
    },
    {
      input: {
        tenant_id: 'valid-tenant-id',
        name: 'Valid Name',
        address: 'Invalid Address',
        unit: 'Valid Unit',
      },
      expected_errors: ['Address must contain a valid 5-digit Postleitzahl (PLZ)']
    },
    {
      input: {
        name: 'Partial Name',
        address: 'Partial Address 12345', // Missing unit and tenant_id
      },
      expected_errors: ['Row must have either Tenant ID, or Name, Address, and Unit', 'Unit is required']
    }
  ],
  
  // CSV injection attempts that should be escaped
  injection: [
    {
      input: {
        name: '=cmd|calc',
        address: '+HYPERLINK("http://evil.com")',
        unit: '-SUM(A1:A10)',
        tenant_id: '@test',
        notes: '=1+1'
      },
      expected_escaped: {
        name: "'=cmd|calc",
        address: "'+HYPERLINK(\"http://evil.com\")",
        unit: "'-SUM(A1:A10)",
        tenant_id: "'@test",
        notes: "'=1+1"
      }
    }
  ]
};

/**
 * Runs all test cases and returns results
 * Can be used for manual verification during development
 */
export function runTestCases() {
  const results = {
    phone: {} as Record<string, any>,
    csv: {} as Record<string, any>,
    address: {} as Record<string, any>,
    validation: {} as Record<string, any>
  };

  // Test phone normalization
  Object.entries(PHONE_NORMALIZATION_TESTS.valid).forEach(([input, expected]) => {
    const result = normalizePhoneNumber(input);
    results.phone[input] = { expected, actual: result, pass: result === expected };
  });

  Object.entries(PHONE_NORMALIZATION_TESTS.invalid).forEach(([input, expected]) => {
    const result = normalizePhoneNumber(input);
    results.phone[input] = { expected, actual: result, pass: result === expected };
  });

  // Test CSV injection protection
  Object.entries(CSV_INJECTION_TESTS.dangerous).forEach(([input, expected]) => {
    const result = escapeCsvFormula(input);
    results.csv[input] = { expected, actual: result, pass: result === expected };
  });

  Object.entries(CSV_INJECTION_TESTS.safe).forEach(([input, expected]) => {
    const result = escapeCsvFormula(input);
    results.csv[input] = { expected, actual: result, pass: result === expected };
  });

  // Test canonical address generation
  CANONICAL_ADDRESS_TESTS.cases.forEach((testCase, index) => {
    const [address, unit] = testCase.input;
    const result = buildCanonicalAddress(address, unit);
    results.address[`test_${index}`] = { 
      expected: testCase.expected, 
      actual: result, 
      pass: result === testCase.expected 
    };
  });

  // Test row validation
  ROW_VALIDATION_TESTS.valid.forEach((testCase, index) => {
    const result = validateRow(testCase.input as ImportRow);
    const allErrorsIncluded = testCase.expected_errors.every(error => 
      result.validation_errors.includes(error)
    );
    results.validation[`valid_${index}`] = {
      pass: result.validation_errors.length === testCase.expected_errors.length &&
            allErrorsIncluded &&
            result.normalized_phone === testCase.expected_phone
    };
  });

  ROW_VALIDATION_TESTS.invalid.forEach((testCase, index) => {
    const result = validateRow(testCase.input as ImportRow);
    const hasExpectedErrors = testCase.expected_errors.every(error => 
      result.validation_errors.includes(error)
    );
    results.validation[`invalid_${index}`] = { pass: hasExpectedErrors };
  });

  return results;
}