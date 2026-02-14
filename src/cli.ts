#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';

const program = new Command();

program
  .name('devstarter')
  .description('CLI to generate and manage development projects with ease')
  .version('0.1.0');

program
  .command('init [projectName]')
  .description('Initialize a new project')
  .option('-y, --yes', 'Use default options and skip prompts')
  .option('-t, --type <type>', 'Project type (frontend | backend)')
  .option('--template <name>', 'Template variant (e.g. basic, react)')
  .option('--dry-run', 'Show what would be generated without creating files')
  .option('--no-git', 'Skip git repository initialization')
  .option('--vitest', 'Add Vitest for testing')
  .action(initCommand);

program
  .command('add [feature]')
  .description('Add a feature to an existing project')
  .option('--dry-run', 'Show what would be added without making changes')
  .option('--list', 'List available features')
  .option('-y, --yes', 'Add all available features without prompting')
  .action(addCommand);

program.parse(process.argv);
