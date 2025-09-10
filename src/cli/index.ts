#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { createProgram } from './program';

// Load environment variables early
dotenv.config();

async function main() {
  try {
    const program = createProgram();
    await program.parseAsync();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
