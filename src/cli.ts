#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('devstarter')
  .description('CLI para generar proyectos con buenas prácticas')
  .version('0.1.0');

program
  .command('init [projectName]')
  .description('Inicializa un nuevo proyecto')
  .option('-y, --yes', 'Use default options and skip prompts')
  .option('-t, --type <type>', 'Project type (frontend | backend)')
  .option('--template <name>', 'Template variant (e.g. basic, react)')
  .option('--dry-run', 'Show what would be generated without creating files')
  .option('--no-git', 'Skip git repository initialization')
  .option('--vitest', 'Add Vitest for testing')
  .action(initCommand);

program.parse(process.argv);
