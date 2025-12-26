#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('devstarter')
  .description('CLI para generar proyectos con buenas prácticas')
  .version('0.1.0');

program
  .command('init')
  .description('Inicializa un nuevo proyecto')
  .action(initCommand);

program.parse(process.argv);
