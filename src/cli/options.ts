import { Command } from 'commander';

export function createOptions(program: Command): void {
  program
    .option('--json', 'Output results in JSON format')
    .option('--ai', 'Generate AI-enhanced suggestions for improvement')
    .option('--verbose', 'Enable verbose logging')
    .option('--config <path>', 'Use custom configuration file');
}
