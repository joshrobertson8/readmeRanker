import chalk from 'chalk';
import { analyzeReadme } from '../../lib/analyzer';
import { generateReport } from '../../lib/reporter';
import { fetchRemoteReadme } from '../../lib/fetcher';
import { generateAISuggestions } from '../../lib/ai-suggestions';
import { TargetResolver } from '../services/target-resolver';
import { OutputFormatter } from '../services/output-formatter';
import { Logger } from '../services/logger';
import { AnalysisResult } from '../../lib/types';

export interface AnalyzeOptions {
  json?: boolean;
  ai?: boolean;
  verbose?: boolean;
  config?: string;
}

export class AnalyzeHandler {
  private targetResolver: TargetResolver;
  private outputFormatter: OutputFormatter;
  private logger: Logger;

  constructor() {
    this.targetResolver = new TargetResolver();
    this.outputFormatter = new OutputFormatter();
    this.logger = new Logger();
  }

  async execute(target: string, options: AnalyzeOptions): Promise<void> {
    try {
      this.logger.setVerbose(!!options.verbose);
      
      // Resolve target and get README content
      const { content, source } = await this.resolveTarget(target);
      
      // Perform analysis
      const analysis = await this.performAnalysis(content, options);
      
      // Output results
      await this.outputResults(analysis, source, options);
      
    } catch (error) {
      this.handleError(error);
    }
  }

  private async resolveTarget(target: string): Promise<{ content: string; source: string }> {
    this.logger.info('Resolving target:', target);
    
    const { isLocal, resolvedPath } = this.targetResolver.resolve(target);
    
    if (isLocal) {
      this.logger.verbose('Analyzing local README...');
      const content = await this.targetResolver.readLocalFile(resolvedPath);
      return { content, source: 'local' };
    } else {
      this.logger.info(chalk.blue('🔍 Fetching README from remote repository...'));
      const content = await fetchRemoteReadme(target);
      return { content, source: target };
    }
  }

  private async performAnalysis(content: string, options: AnalyzeOptions): Promise<AnalysisResult> {
    this.logger.verbose('Performing README analysis...');
    
    const analysis = analyzeReadme(content);
    
    // Generate AI suggestions if requested
    if (options.ai) {
      this.logger.info(this.getAIMessage());
      analysis.suggestions = await generateAISuggestions(analysis, content);
    }
    
    return analysis;
  }

  private async outputResults(analysis: AnalysisResult, source: string, options: AnalyzeOptions): Promise<void> {
    if (options.json) {
      this.outputFormatter.outputJSON(analysis);
    } else {
      generateReport(analysis, source);
    }
  }

  private getAIMessage(): string {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    return chalk.blue(
      hasGeminiKey 
        ? "🤖 Generating AI-enhanced suggestions with Gemini..." 
        : "🤖 Generating enhanced suggestions..."
    );
  }

  private handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : "Unknown error";
    this.logger.error(chalk.red("❌ Error:"), message);
    process.exit(1);
  }
}
