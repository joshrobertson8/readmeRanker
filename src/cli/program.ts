import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze';
import { validateCommand } from './commands/validate';
import { configCommand } from './commands/config';
import { createOptions } from './options';
import { packageInfo } from '../config/package';

export function createProgram(): Command {
  const program = new Command();

  // Basic program configuration
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

  // Add global options
  createOptions(program);

  // Add commands
  analyzeCommand(program);
  validateCommand(program);
  configCommand(program);

  return program;
}
