import { PromptCancelledError } from '../prompts/initPrompts.js';
import { createProject } from '../generators/createProject.js';
import { printSummary } from '../utils/printSummary.js';
import { printDryRun } from '../utils/printDryRun.js';
import { styles } from '../utils/styles.js';
import { collectInitContext } from './init/collector.js';
/**
 * Comando principal para inicializar un nuevo proyecto
 * Orquesta recolección, validación y ejecución
 */
export async function initCommand(projectNameArg, options) {
    try {
        const context = await collectInitContext(projectNameArg, options);
        if (context.isDryRun) {
            printDryRun(context);
            return;
        }
        await createProject(context);
        printSummary(context);
    }
    catch (error) {
        handleError(error);
    }
}
function handleError(error) {
    if (error instanceof PromptCancelledError) {
        console.log(`\n${styles.muted('Operation cancelled')}`);
        return;
    }
    console.error(`\n${styles.error('Error creating project:')}`);
    console.error(styles.muted(error.message));
}
