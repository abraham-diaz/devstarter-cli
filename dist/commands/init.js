import { askInitQuestions } from '../prompts/initPrompts.js';
import { normalizeProjectName } from '../utils/normalize.js';
import { createProject } from '../generators/createProject.js';
import { DEFAULT_INIT_OPTIONS } from '../types/project.js';
export async function initCommand(projectNameArg, options) {
    let answers;
    // 1. Modo no interactivo
    if (options.yes) {
        answers = {
            projectName: projectNameArg ??
                process.cwd().split(/[\\/]/).pop() ??
                'my-app',
            projectType: DEFAULT_INIT_OPTIONS.projectType,
            initGit: DEFAULT_INIT_OPTIONS.initGit,
        };
    }
    else {
        const promptAnswers = await askInitQuestions({
            skipProjectName: Boolean(projectNameArg),
        });
        answers = {
            ...promptAnswers,
            projectName: projectNameArg ?? promptAnswers.projectName,
        };
    }
    const projectName = normalizeProjectName(answers.projectName);
    try {
        await createProject({
            projectName,
            projectType: answers.projectType,
            initGit: answers.initGit,
        });
        console.log(`\nProject "${projectName}" created successfully`);
    }
    catch (error) {
        console.error('\nError creating project:');
        console.error(error.message);
    }
}
