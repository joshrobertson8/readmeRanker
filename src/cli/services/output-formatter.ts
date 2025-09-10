import { AnalysisResult } from '../../lib/types';

export class OutputFormatter {
  outputJSON(analysis: AnalysisResult): void {
    const output = {
      score: analysis.score,
      maxScore: analysis.maxScore,
      percentage: analysis.percentage,
      grade: analysis.grade,
      found: analysis.found,
      missing: analysis.missing,
      suggestions: analysis.suggestions,
      categories: analysis.categories,
      qualityMetrics: analysis.qualityMetrics,
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(output, null, 2));
  }

  outputText(content: string): void {
    console.log(content);
  }
}
