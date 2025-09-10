export interface AnalysisResult {
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  found: string[];
  missing: string[];
  suggestions: string[];
  details: {
    [key: string]: CriteriaScore;
  };
  categories: {
    [category: string]: CategoryScore;
  };
  qualityMetrics: QualityMetrics;
}

export interface CriteriaScore {
  score: number;
  maxScore: number;
  found: boolean;
  confidence: number;
  reason?: string;
  subScores?: { [key: string]: number };
  foundPatterns?: string[];
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
  criteria: string[];
}

export interface QualityMetrics {
  readability: number;
  completeness: number;
  professionalism: number;
  accessibility: number;
  maintainability: number;
}

export interface ScoringCriteria {
  name: string;
  category: string;
  points: number;
  patterns: PatternConfig[];
  required?: boolean;
  weight?: number;
  subCriteria?: SubCriteria[];
}

export interface PatternConfig {
  pattern: string;
  weight: number;
  type: "exact" | "contains" | "regex";
  section?: string;
  context?: string[];
}

export interface SubCriteria {
  name: string;
  points: number;
  patterns: PatternConfig[];
}
