import chalk from 'chalk';

export class Logger {
  private verboseMode: boolean = false;

  setVerbose(verbose: boolean): void {
    this.verboseMode = verbose;
  }

  info(...args: any[]): void {
    console.log(...args);
  }

  verbose(...args: any[]): void {
    if (this.verboseMode) {
      console.log(chalk.gray('[VERBOSE]'), ...args);
    }
  }

  error(...args: any[]): void {
    console.error(...args);
  }

  warn(...args: any[]): void {
    console.warn(chalk.yellow('[WARN]'), ...args);
  }

  success(...args: any[]): void {
    console.log(chalk.green('[SUCCESS]'), ...args);
  }
}
