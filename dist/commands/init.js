import { DEFAULT_INIT_OPTIONS } from '../types/project.js';
import { askInitQuestions, askTemplate, PromptCancelledError, } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';
import { printSummary } from '../utils/printSummary.js';
import { printDryRun } from '../utils/printDryRun.js';
import { detectPackageManager } from '../utils/detectPackageManager.js';
import { listTemplates } from '../utils/listTemplate.js';
import { styles } from '../utils/styles.js';
function resolveProjectType(optionType) {
    if (!optionType)
        return undefined;
    if (optionType === 'frontend' || optionType === 'backend') {
        return optionType;
    }
    throw new Error(`Invalid --type value "${optionType}". Use "frontend" or "backend".`);
}
export async function initCommand(projectNameArg, options) {
    try {
        const typeFromFlag = resolveProjectType(options.type);
        // 1) Obtener projectName, projectType, initGit
        let baseAnswers;
        if (options.yes) {
            baseAnswers = {
                projectName: projectNameArg ??
                    process.cwd().split(/[\\/]/).pop() ??
                    'my-app',
                projectType: typeFromFlag ?? DEFAULT_INIT_OPTIONS.projectType,
                initGit: DEFAULT_INIT_OPTIONS.initGit,
            };
        }
        else {
            const promptAnswers = await askInitQuestions({
                skipProjectName: Boolean(projectNameArg),
                skipProjectType: Boolean(typeFromFlag),
            });
            baseAnswers = {
                ...promptAnswers,
                projectName: projectNameArg ?? promptAnswers.projectName,
                projectType: typeFromFlag ?? promptAnswers.projectType,
            };
        }
        // 2) Obtener templates disponibles y preguntar cuál usar
        const templates = listTemplates(baseAnswers.projectType);
        let template;
        if (templates.length === 0) {
            template = 'basic';
        }
        else if (options.yes || templates.length === 1) {
            template = templates[0];
        }
        else {
            const templateAnswer = await askTemplate({ templates });
            template = templateAnswer.template;
        }
        const answers = {
            ...baseAnswers,
            template,
        };
        const projectName = normalizeProjectName(answers.projectName);
        const packageManager = detectPackageManager();
        const isDryRun = Boolean(options.dryRun);
        if (isDryRun) {
            printDryRun({
                projectName,
                projectType: answers.projectType,
                template: answers.template,
                initGit: answers.initGit,
                packageManager,
            });
            return;
        }
        await createProject({
            projectName,
            projectType: answers.projectType,
            template: answers.template,
            initGit: answers.initGit,
        });
        printSummary({
            projectName,
            projectType: answers.projectType,
            template: answers.template,
            initGit: answers.initGit,
            packageManager,
        });
    }
    catch (error) {
        if (error instanceof PromptCancelledError) {
            console.log(`\n${styles.muted('Operation cancelled')}`);
            return;
        }
        console.error(`\n${styles.error('Error creating project:')}`);
        console.error(styles.muted(error.message));
    }
}
