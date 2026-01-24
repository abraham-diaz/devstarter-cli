import prompts from 'prompts';
export class PromptCancelledError extends Error {
    constructor() {
        super('Operation cancelled');
        this.name = 'PromptCancelledError';
    }
}
const onCancel = () => {
    throw new PromptCancelledError();
};
export async function askProjectName() {
    return prompts({
        type: 'text',
        name: 'projectName',
        message: 'Project name:',
        validate: (value) => value.length < 1 ? 'Project name is required' : true,
    }, { onCancel });
}
export async function askProjectStructure() {
    return prompts({
        type: 'select',
        name: 'projectStructure',
        message: 'Project structure:',
        choices: [
            { title: 'Basic', value: 'basic', description: 'Single project (frontend or backend)' },
            { title: 'Monorepo', value: 'monorepo', description: 'Full-stack with apps/web + apps/api' },
        ],
    }, { onCancel });
}
export async function askInitQuestions(options = {}) {
    const questions = [];
    if (!options.skipProjectName) {
        questions.push({
            type: 'text',
            name: 'projectName',
            message: 'Project name:',
            validate: (value) => value.length < 1 ? 'Project name is required' : true,
        });
    }
    if (!options.skipProjectType) {
        questions.push({
            type: 'select',
            name: 'projectType',
            message: 'Project type:',
            choices: [
                { title: 'Frontend', value: 'frontend' },
                { title: 'Backend', value: 'backend' },
            ],
        });
    }
    if (!options.skipInitGit) {
        questions.push({
            type: 'confirm',
            name: 'initGit',
            message: 'Initialize a git repository?',
            initial: true,
        });
    }
    return prompts(questions, { onCancel });
}
export async function askTemplate(options) {
    if (options.templates.length === 1) {
        return { template: options.templates[0] };
    }
    return prompts({
        type: 'select',
        name: 'template',
        message: options.message ?? 'Template:',
        choices: options.templates.map((t) => ({
            title: t,
            value: t,
        })),
    }, { onCancel });
}
export async function askInitGit() {
    return prompts({
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize a git repository?',
        initial: true,
    }, { onCancel });
}
export async function askUseVitest() {
    return prompts({
        type: 'confirm',
        name: 'useVitest',
        message: 'Add Vitest for testing?',
        initial: false,
    }, { onCancel });
}
