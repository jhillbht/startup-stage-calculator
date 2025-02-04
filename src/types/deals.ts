// Type definitions for the StartupStage Calculator

// Represents a single deal/tool offering
export interface Deal {
  id: string;
  product_name: string;
  title: string;
  savings: number;
  requiresNewSignup: boolean;
  searchTerms: string[];
  redeems_count: number;
  active: boolean;
}

// Extended interface for search results with match scoring
export interface SearchResult extends Deal {
  matchScore?: number;
}