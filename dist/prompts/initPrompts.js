import prompts from 'prompts';
export async function askInitQuestions() {
    return prompts([
        {
            type: 'text',
            name: 'projectName',
            message: 'Project name:',
            validate: (value) => value.length < 1 ? 'Project name is required' : true,
        },
        {
            type: 'select',
            name: 'projectType',
            message: 'Project type:',
            choices: [
                { title: 'Frontend', value: 'frontend' },
                { title: 'Backend', value: 'backend' },
            ],
        },
        {
            type: 'confirm',
            name: 'initGit',
            message: 'Initialize a git repository?',
            initial: true,
        },
    ]);
}
