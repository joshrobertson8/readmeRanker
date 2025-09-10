import {
  AnalysisResult,
  ScoringCriteria,
  PatternConfig,
  CriteriaScore,
  CategoryScore,
  QualityMetrics,
} from "./types";

// Comprehensive scoring criteria with weighted patterns and categories
const SCORING_CRITERIA: ScoringCriteria[] = [
  // ESSENTIAL DOCUMENTATION (35 points)
  {
    name: "Project Title & Description",
    category: "Essential Documentation",
    points: 15,
    patterns: [
      { pattern: "^# ", weight: 3, type: "regex" },
      { pattern: "description", weight: 2, type: "contains" },
      { pattern: "what (is|does)", weight: 2, type: "regex" },
      { pattern: "overview", weight: 1, type: "contains" },
      { pattern: "about", weight: 1, type: "contains" },
    ],
    subCriteria: [
      {
        name: "Clear Title",
        points: 5,
        patterns: [{ pattern: "^# [A-Za-z]", weight: 1, type: "regex" }],
      },
      {
        name: "Project Description",
        points: 5,
        patterns: [
          { pattern: "description", weight: 1, type: "contains" },
          { pattern: "what (is|does)", weight: 1, type: "regex" },
        ],
      },
      {
        name: "Purpose/Problem Statement",
        points: 5,
        patterns: [
          { pattern: "problem", weight: 1, type: "contains" },
          { pattern: "solves", weight: 1, type: "contains" },
          { pattern: "purpose", weight: 1, type: "contains" },
        ],
      },
    ],
  },
  {
    name: "Installation Instructions",
    category: "Essential Documentation",
    points: 20,
    patterns: [
      { pattern: "install", weight: 3, type: "contains" },
      { pattern: "npm install", weight: 3, type: "contains" },
      { pattern: "pip install", weight: 3, type: "contains" },
      { pattern: "yarn (install|add)", weight: 2, type: "regex" },
      { pattern: "setup", weight: 2, type: "contains" },
      { pattern: "getting started", weight: 2, type: "contains" },
      { pattern: "requirements", weight: 2, type: "contains" },
      { pattern: "prerequisites", weight: 2, type: "contains" },
    ],
    subCriteria: [
      {
        name: "Package Manager Commands",
        points: 8,
        patterns: [
          { pattern: "npm install", weight: 2, type: "contains" },
          { pattern: "pip install", weight: 2, type: "contains" },
          { pattern: "yarn", weight: 1, type: "contains" },
        ],
      },
      {
        name: "Prerequisites",
        points: 6,
        patterns: [
          { pattern: "requirements", weight: 1, type: "contains" },
          { pattern: "prerequisites", weight: 1, type: "contains" },
          { pattern: "dependencies", weight: 1, type: "contains" },
        ],
      },
      {
        name: "Step-by-step Guide",
        points: 6,
        patterns: [
          { pattern: "1\\.", weight: 1, type: "regex" },
          { pattern: "step", weight: 1, type: "contains" },
          { pattern: "first", weight: 1, type: "contains" },
        ],
      },
    ],
  },

  // USAGE & EXAMPLES (30 points)
  {
    name: "Usage Examples",
    category: "Usage & Examples",
    points: 20,
    patterns: [
      { pattern: "usage", weight: 3, type: "contains" },
      { pattern: "example", weight: 3, type: "contains" },
      { pattern: "```", weight: 3, type: "contains" },
      { pattern: "how to use", weight: 2, type: "contains" },
      { pattern: "quick start", weight: 2, type: "contains" },
      { pattern: "demo", weight: 1, type: "contains" },
    ],
    subCriteria: [
      {
        name: "Code Examples",
        points: 10,
        patterns: [
          { pattern: "```", weight: 3, type: "contains" },
          { pattern: "`[^`]+`", weight: 2, type: "regex" },
        ],
      },
      {
        name: "Multiple Examples",
        points: 5,
        patterns: [
          { pattern: "example", weight: 2, type: "contains" },
          { pattern: "basic", weight: 1, type: "contains" },
          { pattern: "advanced", weight: 1, type: "contains" },
        ],
      },
      {
        name: "Output Examples",
        points: 5,
        patterns: [
          { pattern: "output", weight: 1, type: "contains" },
          { pattern: "result", weight: 1, type: "contains" },
        ],
      },
    ],
  },
  {
    name: "API Documentation",
    category: "Usage & Examples",
    points: 10,
    patterns: [
      { pattern: "api", weight: 3, type: "contains" },
      { pattern: "methods", weight: 2, type: "contains" },
      { pattern: "functions", weight: 2, type: "contains" },
      { pattern: "endpoints", weight: 2, type: "contains" },
      { pattern: "reference", weight: 1, type: "contains" },
      { pattern: "documentation", weight: 1, type: "contains" },
    ],
  },

  // VISUAL & DEMO (20 points)
  {
    name: "Visual Demonstrations",
    category: "Visual & Demo",
    points: 15,
    patterns: [
      {
        pattern: "!\\[.*\\]\\(.*\\.(png|jpg|jpeg|gif|svg)\\)",
        weight: 4,
        type: "regex",
      },
      { pattern: "screenshot", weight: 2, type: "contains" },
      { pattern: "demo", weight: 2, type: "contains" },
      { pattern: "preview", weight: 2, type: "contains" },
      { pattern: "video", weight: 2, type: "contains" },
      { pattern: "gif", weight: 2, type: "contains" },
    ],
  },
  {
    name: "Live Demo Links",
    category: "Visual & Demo",
    points: 5,
    patterns: [
      { pattern: "demo", weight: 2, type: "contains" },
      { pattern: "live", weight: 2, type: "contains" },
      { pattern: "playground", weight: 1, type: "contains" },
      { pattern: "try it", weight: 1, type: "contains" },
    ],
  },

  // PROJECT QUALITY (25 points)
  {
    name: "Status Badges",
    category: "Project Quality",
    points: 10,
    patterns: [
      { pattern: "!\\[.*\\]\\(https://.*badge", weight: 3, type: "regex" },
      { pattern: "build", weight: 2, type: "contains" },
      { pattern: "coverage", weight: 2, type: "contains" },
      { pattern: "version", weight: 1, type: "contains" },
      { pattern: "license", weight: 1, type: "contains" },
      { pattern: "downloads", weight: 1, type: "contains" },
    ],
  },
  {
    name: "Testing Information",
    category: "Project Quality",
    points: 8,
    patterns: [
      { pattern: "test", weight: 2, type: "contains" },
      { pattern: "testing", weight: 2, type: "contains" },
      { pattern: "coverage", weight: 2, type: "contains" },
      { pattern: "ci", weight: 1, type: "contains" },
      { pattern: "continuous integration", weight: 2, type: "contains" },
    ],
  },
  {
    name: "Changelog/Versioning",
    category: "Project Quality",
    points: 7,
    patterns: [
      { pattern: "changelog", weight: 2, type: "contains" },
      { pattern: "version", weight: 1, type: "contains" },
      { pattern: "release", weight: 1, type: "contains" },
      { pattern: "history", weight: 1, type: "contains" },
    ],
  },

  // COMMUNITY & LEGAL (20 points)
  {
    name: "Contributing Guidelines",
    category: "Community & Legal",
    points: 8,
    patterns: [
      { pattern: "contributing", weight: 3, type: "contains" },
      { pattern: "contribute", weight: 2, type: "contains" },
      { pattern: "pull request", weight: 2, type: "contains" },
      { pattern: "issues", weight: 1, type: "contains" },
      { pattern: "guidelines", weight: 1, type: "contains" },
    ],
  },
  {
    name: "License Information",
    category: "Community & Legal",
    points: 7,
    patterns: [
      { pattern: "license", weight: 3, type: "contains" },
      { pattern: "mit", weight: 2, type: "contains" },
      { pattern: "apache", weight: 2, type: "contains" },
      { pattern: "gpl", weight: 2, type: "contains" },
      { pattern: "copyright", weight: 1, type: "contains" },
    ],
  },
  {
    name: "Contact Information",
    category: "Community & Legal",
    points: 5,
    patterns: [
      { pattern: "author", weight: 2, type: "contains" },
      { pattern: "maintainer", weight: 2, type: "contains" },
      { pattern: "contact", weight: 2, type: "contains" },
      { pattern: "support", weight: 1, type: "contains" },
      { pattern: "@\\w+", weight: 1, type: "regex" },
    ],
  },

  // ADVANCED FEATURES (20 points)
  {
    name: "Configuration Documentation",
    category: "Advanced Features",
    points: 6,
    patterns: [
      { pattern: "config", weight: 2, type: "contains" },
      { pattern: "options", weight: 2, type: "contains" },
      { pattern: "settings", weight: 1, type: "contains" },
      { pattern: "parameters", weight: 1, type: "contains" },
    ],
  },
  {
    name: "Troubleshooting",
    category: "Advanced Features",
    points: 6,
    patterns: [
      { pattern: "troubleshoot", weight: 2, type: "contains" },
      { pattern: "faq", weight: 2, type: "contains" },
      { pattern: "common issues", weight: 2, type: "contains" },
      { pattern: "problems", weight: 1, type: "contains" },
    ],
  },
  {
    name: "Performance & Benchmarks",
    category: "Advanced Features",
    points: 4,
    patterns: [
      { pattern: "performance", weight: 2, type: "contains" },
      { pattern: "benchmark", weight: 2, type: "contains" },
      { pattern: "speed", weight: 1, type: "contains" },
    ],
  },
  {
    name: "Security Information",
    category: "Advanced Features",
    points: 4,
    patterns: [
      { pattern: "security", weight: 2, type: "contains" },
      { pattern: "vulnerability", weight: 1, type: "contains" },
      { pattern: "secure", weight: 1, type: "contains" },
    ],
  },
];

const CATEGORY_WEIGHTS: { [key: string]: number } = {
  "Essential Documentation": 1.2,
  "Usage & Examples": 1.1,
  "Visual & Demo": 1.0,
  "Project Quality": 1.0,
  "Community & Legal": 0.9,
  "Advanced Features": 0.8,
};

export function analyzeReadme(content: string): AnalysisResult {
  const normalizedContent = content.toLowerCase();
  const lines = content.split("\n");
  const sections = extractSections(content);

  const result: AnalysisResult = {
    score: 0,
    maxScore: 0,
    percentage: 0,
    grade: "",
    found: [],
    missing: [],
    suggestions: [],
    details: {},
    categories: {},
    qualityMetrics: {
      readability: 0,
      completeness: 0,
      professionalism: 0,
      accessibility: 0,
      maintainability: 0,
    },
  };

  // Initialize categories
  const categoryScores: { [key: string]: CategoryScore } = {};

  // Analyze each criteria
  for (const criteria of SCORING_CRITERIA) {
    const criteriaResult = analyzeCriteria(
      criteria,
      normalizedContent,
      content,
      sections
    );
    const weightedScore =
      criteriaResult.score * (CATEGORY_WEIGHTS[criteria.category] || 1);

    result.details[criteria.name] = criteriaResult;
    result.score += weightedScore;
    result.maxScore +=
      criteria.points * (CATEGORY_WEIGHTS[criteria.category] || 1);

    // Update category scores
    if (!categoryScores[criteria.category]) {
      categoryScores[criteria.category] = {
        score: 0,
        maxScore: 0,
        percentage: 0,
        criteria: [],
      };
    }

    categoryScores[criteria.category].score += weightedScore;
    categoryScores[criteria.category].maxScore +=
      criteria.points * (CATEGORY_WEIGHTS[criteria.category] || 1);
    categoryScores[criteria.category].criteria.push(criteria.name);

    if (criteriaResult.found) {
      result.found.push(criteria.name);
    } else {
      result.missing.push(criteria.name);
      result.suggestions.push(
        generateEnhancedSuggestion(criteria.name, criteriaResult)
      );
    }
  }

  // Calculate category percentages
  for (const category in categoryScores) {
    categoryScores[category].percentage =
      (categoryScores[category].score / categoryScores[category].maxScore) *
      100;
  }

  result.categories = categoryScores;
  result.percentage = (result.score / result.maxScore) * 100;
  result.grade = calculateGrade(result.percentage);
  result.qualityMetrics = calculateQualityMetrics(content, result);

  return result;
}

function analyzeCriteria(
  criteria: ScoringCriteria,
  normalizedContent: string,
  originalContent: string,
  sections: string[]
): CriteriaScore {
  let totalScore = 0;
  let confidence = 0;
  const foundPatterns: string[] = [];
  const subScores: { [key: string]: number } = {};

  // Main pattern analysis
  for (const patternConfig of criteria.patterns) {
    const { found, matchConfidence } = matchPattern(
      patternConfig,
      normalizedContent,
      originalContent
    );
    if (found) {
      totalScore += patternConfig.weight;
      confidence += matchConfidence;
      foundPatterns.push(patternConfig.pattern);
    }
  }

  // Sub-criteria analysis
  if (criteria.subCriteria) {
    for (const subCriteria of criteria.subCriteria) {
      let subScore = 0;
      for (const patternConfig of subCriteria.patterns) {
        const { found } = matchPattern(
          patternConfig,
          normalizedContent,
          originalContent
        );
        if (found) {
          subScore += patternConfig.weight;
        }
      }
      subScores[subCriteria.name] =
        Math.min(subScore / subCriteria.patterns.length, 1) *
        subCriteria.points;
    }
  }

  // Calculate final score
  const maxPatternWeight = criteria.patterns.reduce(
    (sum, p) => sum + p.weight,
    0
  );
  const patternScore = Math.min(totalScore / maxPatternWeight, 1);
  const subCriteriaScore = Object.values(subScores).reduce(
    (sum, score) => sum + score,
    0
  );

  const finalScore = criteria.subCriteria
    ? subCriteriaScore
    : patternScore * criteria.points;

  return {
    score: Math.min(finalScore, criteria.points),
    maxScore: criteria.points,
    found: finalScore > 0,
    confidence: confidence / criteria.patterns.length,
    foundPatterns,
    subScores: criteria.subCriteria ? subScores : undefined,
    reason: generateReason(finalScore, criteria.points, foundPatterns),
  };
}

function matchPattern(
  patternConfig: PatternConfig,
  normalizedContent: string,
  originalContent: string
): { found: boolean; matchConfidence: number } {
  const content =
    patternConfig.type === "regex" ? originalContent : normalizedContent;
  let found = false;
  let matchConfidence = 0;

  switch (patternConfig.type) {
    case "exact":
      found = content === patternConfig.pattern.toLowerCase();
      matchConfidence = found ? 1.0 : 0;
      break;
    case "contains":
      found = content.includes(patternConfig.pattern.toLowerCase());
      matchConfidence = found ? 0.8 : 0;
      break;
    case "regex":
      const regex = new RegExp(patternConfig.pattern, "gi");
      const matches = content.match(regex);
      found = matches !== null;
      matchConfidence = found ? Math.min(matches!.length * 0.3, 1.0) : 0;
      break;
  }

  return { found, matchConfidence };
}

function extractSections(content: string): string[] {
  const headerRegex = /^#+\s+(.+)$/gm;
  const sections: string[] = [];
  let match;

  while ((match = headerRegex.exec(content)) !== null) {
    sections.push(match[1].toLowerCase());
  }

  return sections;
}

function calculateGrade(percentage: number): string {
  if (percentage >= 95) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 85) return "A-";
  if (percentage >= 80) return "B+";
  if (percentage >= 75) return "B";
  if (percentage >= 70) return "B-";
  if (percentage >= 65) return "C+";
  if (percentage >= 60) return "C";
  if (percentage >= 55) return "C-";
  if (percentage >= 50) return "D+";
  if (percentage >= 45) return "D";
  if (percentage >= 40) return "D-";
  return "F";
}

function calculateQualityMetrics(
  content: string,
  result: AnalysisResult
): QualityMetrics {
  const lines = content.split("\n");
  const wordCount = content.split(/\s+/).length;

  return {
    readability: calculateReadability(content, lines),
    completeness: result.percentage / 100,
    professionalism: calculateProfessionalism(content, result),
    accessibility: calculateAccessibility(content),
    maintainability: calculateMaintainability(content, result),
  };
}

function calculateReadability(content: string, lines: string[]): number {
  let score = 0;

  // Check for clear structure
  if (content.match(/^#+\s/gm)) score += 0.3;

  // Check for code blocks
  if (content.includes("```")) score += 0.2;

  // Check for lists
  if (content.match(/^[\*\-\+]\s/gm)) score += 0.2;

  // Check for reasonable line length
  const avgLineLength =
    lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  if (avgLineLength < 120) score += 0.3;

  return Math.min(score, 1);
}

function calculateProfessionalism(
  content: string,
  result: AnalysisResult
): number {
  let score = 0;

  // Check for badges
  if (content.match(/!\[.*\]\(https:\/\/.*badge/)) score += 0.3;

  // Check for proper formatting
  if (content.includes("```")) score += 0.2;

  // Check for license
  if (result.found.includes("License Information")) score += 0.2;

  // Check for contributing guidelines
  if (result.found.includes("Contributing Guidelines")) score += 0.3;

  return Math.min(score, 1);
}

function calculateAccessibility(content: string): number {
  let score = 0;

  // Check for alt text in images
  const images = content.match(/!\[([^\]]*)\]/g);
  if (images) {
    const withAltText = images.filter((img) => img.length > 4).length;
    score += (withAltText / images.length) * 0.4;
  }

  // Check for clear headings
  if (content.match(/^#+\s/gm)) score += 0.3;

  // Check for descriptive links
  const links = content.match(/\[([^\]]+)\]/g);
  if (links) {
    const descriptive = links.filter((link) => link.length > 6).length;
    score += (descriptive / links.length) * 0.3;
  }

  return Math.min(score, 1);
}

function calculateMaintainability(
  content: string,
  result: AnalysisResult
): number {
  let score = 0;

  // Check for version info
  if (content.toLowerCase().includes("version")) score += 0.2;

  // Check for changelog
  if (content.toLowerCase().includes("changelog")) score += 0.3;

  // Check for contributing guidelines
  if (result.found.includes("Contributing Guidelines")) score += 0.3;

  // Check for issue templates or links
  if (content.toLowerCase().includes("issue")) score += 0.2;

  return Math.min(score, 1);
}

function generateReason(
  score: number,
  maxScore: number,
  foundPatterns: string[]
): string {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    return `Excellent coverage found (${foundPatterns.length} patterns matched)`;
  } else if (percentage >= 60) {
    return `Good coverage found (${foundPatterns.length} patterns matched)`;
  } else if (percentage >= 40) {
    return `Partial coverage found (${foundPatterns.length} patterns matched)`;
  } else if (foundPatterns.length > 0) {
    return `Limited coverage found (${foundPatterns.length} patterns matched)`;
  } else {
    return "No relevant content detected";
  }
}

function generateEnhancedSuggestion(
  criteriaName: string,
  criteriaResult: CriteriaScore
): string {
  const suggestions: { [key: string]: string } = {
    "Project Title & Description":
      "Add a compelling project title and clear description that explains what your project does and its main benefits",
    "Installation Instructions":
      "Include comprehensive installation instructions with package manager commands, prerequisites, and step-by-step setup guide",
    "Usage Examples":
      "Provide multiple code examples showing basic and advanced usage scenarios with expected outputs",
    "API Documentation":
      "Document your API methods, functions, or main features with parameters and return values",
    "Visual Demonstrations":
      "Add screenshots, GIFs, or diagrams to visually demonstrate your project's functionality",
    "Live Demo Links":
      "Include links to live demos, playgrounds, or hosted versions of your project",
    "Status Badges":
      "Add status badges for build status, test coverage, version, downloads, and other quality metrics",
    "Testing Information":
      "Document your testing approach, how to run tests, and include coverage information",
    "Changelog/Versioning":
      "Maintain a changelog and document version history and release notes",
    "Contributing Guidelines":
      "Create detailed contributing guidelines including code style, development setup, and submission process",
    "License Information":
      "Clearly specify your project's license and include copyright information",
    "Contact Information":
      "Provide maintainer contact information and support channels",
    "Configuration Documentation":
      "Document configuration options, settings, and customization possibilities",
    Troubleshooting:
      "Include a troubleshooting section or FAQ addressing common issues and solutions",
    "Performance & Benchmarks":
      "Share performance characteristics, benchmarks, or optimization information",
    "Security Information":
      "Document security considerations, best practices, or vulnerability reporting procedures",
  };

  let suggestion =
    suggestions[criteriaName] ||
    `Consider improving the ${criteriaName.toLowerCase()} section`;

  // Add specific recommendations based on sub-scores
  if (criteriaResult.subScores) {
    const missing = Object.entries(criteriaResult.subScores)
      .filter(([_, score]) => score === 0)
      .map(([name, _]) => name);

    if (missing.length > 0) {
      suggestion += `. Focus particularly on: ${missing.join(", ")}`;
    }
  }

  return suggestion;
}
