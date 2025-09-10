import { Command } from 'commander';
import { ValidateHandler } from '../handlers/validate-handler';

export function validateCommand(program: Command): void {
  const validateCmd = program
    .command('validate')
    .description('Validate README format and structure without scoring')
    .argument('[target]', 'Local directory or GitHub repository', '.')
    .option('--strict', 'Use strict validation rules')
    .action(async (target: string, options: any) => {
      const handler = new ValidateHandler();
      await handler.execute(target, options);
    });
}
