// Utility functions for text formatting and data processing

/**
 * Format a number as currency with USD formatting
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Normalize text for consistent searching by removing special characters
 * and converting to lowercase
 * @param text - The text to normalize
 * @returns Normalized text string
 */
export const normalizeText = (text: string): string => {
  return text.trim().toLowerCase().replace(/[^\w\s]/g, '');
};

/**
 * Create an array of searchable terms from a product's text content
 * Splits words and creates combinations for better search matching
 * @param productName - The name of the product
 * @param title - The product's title or description
 * @returns Array of searchable terms
 */
export const createSearchableTerms = (productName: string, title: string): string[] => {
  const terms = new Set([
    normalizeText(productName),
    ...productName.split(' ').map(normalizeText),
    normalizeText(title),
    ...title.split(' ').map(normalizeText)
  ]);
  return Array.from(terms).filter(term => term.length > 0);
};