import { DEFAULT_INIT_OPTIONS } from '../types/project.js';
import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';
import { printSummary } from '../utils/printSummary.js';
import { printDryRun } from '../utils/printDryRun.js';
import { detectPackageManager } from '../utils/detectPackageManager.js';
const packageManager = detectPackageManager();
function resolveProjectType(optionType) {
    if (!optionType)
        return undefined;
    if (optionType === 'frontend' || optionType === 'backend') {
        return optionType;
    }
    throw new Error(`Invalid --type value "${optionType}". Use "frontend" or "backend".`);
}
export async function initCommand(projectNameArg, options) {
    let answers;
    const typeFromFlag = resolveProjectType(options.type);
    // 1) Modo no interactivo
    if (options.yes) {
        answers = {
            projectName: projectNameArg ??
                process.cwd().split(/[\\/]/).pop() ??
                'my-app',
            projectType: typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType,
            initGit: DEFAULT_INIT_OPTIONS.initGit,
        };
    }
    else {
        // 2) Modo interactivo
        const promptAnswers = await askInitQuestions({
            skipProjectName: Boolean(projectNameArg),
            // si hay --type, no preguntamos tipo
            skipProjectType: Boolean(typeFromFlag),
        });
        answers = {
            ...promptAnswers,
            projectName: projectNameArg ?? promptAnswers.projectName,
            projectType: typeFromFlag ?? promptAnswers.projectType,
        };
    }
    const projectName = normalizeProjectName(answers.projectName);
    const isDryRun = Boolean(options.dryRun);
    if (isDryRun) {
        printDryRun({
            projectName,
            projectType: answers.projectType,
            initGit: answers.initGit,
            packageManager
        });
        return;
    }
    try {
        await createProject({
            projectName,
            projectType: answers.projectType,
            initGit: answers.initGit,
        });
        printSummary({
            projectName,
            projectType: answers.projectType,
            initGit: answers.initGit,
            packageManager,
        });
    }
    catch (error) {
        console.error('\nError creating project:');
        console.error(error.message);
    }
}
