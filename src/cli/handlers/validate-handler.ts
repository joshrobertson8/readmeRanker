import chalk from 'chalk';
import { TargetResolver } from '../services/target-resolver';
import { Logger } from '../services/logger';

export class ValidateHandler {
  private targetResolver: TargetResolver;
  private logger: Logger;

  constructor() {
    this.targetResolver = new TargetResolver();
    this.logger = new Logger();
  }

  async execute(target: string, options: { strict?: boolean }): Promise<void> {
    try {
      this.logger.info(chalk.blue('🔍 Validating README structure...'));
      
      const { content, source } = await this.resolveTarget(target);
      const issues = this.validateStructure(content, options.strict);
      
      if (issues.length === 0) {
        this.logger.success('✅ README validation passed!');
      } else {
        this.logger.warn(`⚠️  Found ${issues.length} validation issues:`);
        issues.forEach(issue => console.log(chalk.yellow(`  • ${issue}`)));
      }
      
    } catch (error) {
      this.handleError(error);
    }
  }

  private async resolveTarget(target: string): Promise<{ content: string; source: string }> {
    const { isLocal, resolvedPath } = this.targetResolver.resolve(target);
    
    if (isLocal) {
      const content = await this.targetResolver.readLocalFile(resolvedPath);
      return { content, source: 'local' };
    } else {
      const { fetchRemoteReadme } = await import('../../lib/fetcher');
      const content = await fetchRemoteReadme(target);
      return { content, source: target };
    }
  }

  private validateStructure(content: string, strict: boolean = false): string[] {
    const issues: string[] = [];
    
    // Basic validations
    if (content.length < 100) {
      issues.push('README is too short (less than 100 characters)');
    }
    
    if (!content.includes('#')) {
      issues.push('No headings found');
    }
    
    if (strict) {
      // Strict validations
      if (!content.match(/^#\s+/m)) {
        issues.push('Missing main title (# heading)');
      }
      
      if (!content.includes('##')) {
        issues.push('No section headings found (## headings)');
      }
      
      if (!content.includes('```')) {
        issues.push('No code blocks found');
      }
    }
    
    return issues;
  }

  private handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : "Unknown error";
    this.logger.error(chalk.red("❌ Validation failed:"), message);
    process.exit(1);
  }
}
