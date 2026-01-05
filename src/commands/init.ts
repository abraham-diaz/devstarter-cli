import type { InitCommandOptions } from '../types/cli.js';
import { PromptCancelledError } from '../prompts/initPrompts.js';
import { createProject } from '../generators/createProject.js';
import { createMonorepo } from '../generators/createMonorepo.js';
import { printSummary } from '../utils/printSummary.js';
import { printDryRun } from '../utils/printDryRun.js';
import { styles } from '../utils/styles.js';
import { collectInitContext } from './init/collector.js';

/**
 * Comando principal para inicializar un nuevo proyecto
 * Orquesta recolección, validación y ejecución
 */
export async function initCommand(
  projectNameArg: string | undefined,
  options: InitCommandOptions,
): Promise<void> {
  try {
    const context = await collectInitContext(projectNameArg, options);

    if (context.isDryRun) {
      printDryRun(context);
      return;
    }

    if (context.structure === 'monorepo') {
      await createMonorepo(context);
    } else {
      await createProject(context);
    }

    printSummary(context);
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: unknown): void {
  if (error instanceof PromptCancelledError) {
    console.log(`\n${styles.muted('Operation cancelled')}`);
    return;
  }
  console.error(`\n${styles.error('Error creating project:')}`);
  console.error(styles.muted((error as Error).message));
}
